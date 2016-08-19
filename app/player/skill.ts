import { GLOBALS } from '../globals';
import { Skill, RawSkill } from './skill.interface';

export interface SkillDelta {
    pointsGained: number;
    levelsGained: number;
}

export class LiveSkill implements Skill {
    public aptitudeBonus = 0;
    public levelBonus = 0;
    constructor(
        public id: number,
        public name: string,
        // starting from 0
        public baseLevel: number,
        public baseAptitude: number,
        public points: number
    ){}

    toJSON() : RawSkill {
        return {
            id: this.id,
            name: this.name,
            baseLevel: this.baseLevel,
            baseAptitude: this.baseAptitude,
            points: this.points
        };
    }

    static fromJSON(raw: RawSkill) : LiveSkill {
        return new LiveSkill(raw.id, raw.name, raw.baseLevel,
            raw.baseAptitude, raw.points);
    }

    get level() {
        return this.baseLevel + this.levelBonus;
    }
    get aptitude() {
        return this.baseAptitude + this.aptitudeBonus;
    }
    progress() {
        return {numerator: this.points, denominator: this.pointsForNextLevel};
    }
    train(points: number) : SkillDelta {
        let pointGain = points * this.aptitude;
        let newTotal = this.points + pointGain;
        let thresh = this.pointsForNextLevel;
        let levelDelta = 0;
        while (newTotal >= thresh) {
            this.baseLevel++;
            levelDelta++;
            newTotal -= thresh;
            thresh = this.pointsForNextLevel;
        }
        this.points = newTotal;
        return {pointsGained: pointGain, levelsGained: levelDelta};
    }

    get pointsForNextLevel() : number {
        return LiveSkill.pointsForNextLevel(this.baseLevel);
    }

    static pointsForNextLevel(level: number) : number {
        // 100, 200, 400, etc. probably too steep
        return GLOBALS.skillLevelBaseCost * Math.pow(2, level);
    }

}
