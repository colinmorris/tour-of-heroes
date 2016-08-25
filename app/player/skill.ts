import { GLOBALS } from '../globals';
import { Skill, RawSkill } from './skill.interface';

export interface SkillDelta {
    pointsGained: number;
    levelsGained: number;
}

export class LiveSkill implements Skill {
    public aptitudeBonus = 0;
    public levelBonus = 0;
    public baseLevel: number;
    // Points 'leftover' after accounting for whole skill levels
    public floatingPoints: number;
    constructor(
        public id: number,
        public name: string,
        public baseAptitude: number,
        public points: number
    ){
        this.crunchStartingPoints();
    }


    private crunchStartingPoints() {
        let usedPoints = 0;
        let floatingPoints = this.points;
        let lvl = 0;
        let nextLump = LiveSkill.pointsForNextLevel(lvl);
        while (nextLump <= floatingPoints) {
            floatingPoints -= nextLump;
            usedPoints += nextLump;
            lvl++;
            nextLump = LiveSkill.pointsForNextLevel(lvl);
        }
        this.baseLevel = lvl;
        this.floatingPoints = floatingPoints;
    }

    toJSON() : RawSkill {
        return {
            id: this.id,
            name: this.name,
            baseAptitude: this.baseAptitude,
            points: this.points
        };
    }

    static fromJSON(raw: RawSkill) : LiveSkill {
        return new LiveSkill(raw.id, raw.name,
            raw.baseAptitude, raw.points);
    }

    get level() {
        return this.baseLevel + this.levelBonus;
    }
    get aptitude() {
        return this.baseAptitude + this.aptitudeBonus;
    }
    progress() {
        return {numerator: this.floatingPoints, denominator: this.pointsForNextLevel};
    }
    train(points: number) : SkillDelta {
        let pointGain = points * this.aptitude;
        this.points += pointGain;
        let newFloat = this.floatingPoints + pointGain;
        let thresh = this.pointsForNextLevel;
        let levelDelta = 0;
        while (newFloat >= thresh) {
            this.baseLevel++;
            levelDelta++;
            newFloat -= thresh;
            thresh = this.pointsForNextLevel;
        }
        this.floatingPoints = newFloat;
        return {pointsGained: pointGain, levelsGained: levelDelta};
    }

    get pointsForNextLevel() : number {
        return LiveSkill.pointsForNextLevel(this.baseLevel);
    }

    static pointsForNextLevel(level: number) : number {
        let raw = Math.floor(GLOBALS.skillLevelBaseCost *
            Math.pow(GLOBALS.skillLevelExpPointCostBase, level));
        let remainder = raw % 5;
        return raw - remainder;
    }

}
