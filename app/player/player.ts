import { skillMapFromFactory, SkillMapOf, SkillMap, SkillType } from '../core/index';
import { Skill } from './skill';
import { GLOBALS } from '../globals';

export class Player {
    constructor(
        public name: string,
        // Starts from 1 (unlike skills)
        public level: number,
        public klass: string,
        public skills: SkillMapOf<Skill>
    ) {
        this.totalSkillLevels = 0;
    }

    static newbornSkills(aptitudes: SkillMap) {
        return skillMapFromFactory<Skill>(
            (s: SkillType) => {
                return new Skill(s, SkillType[s], 0, aptitudes[s], 0);
            }
        );
    }

    static newborn(name: string, klass:string, aptitudes: SkillMap) {
        return new Player(name, 1, klass,
                             Player.newbornSkills(aptitudes)
                            );
    }

    private totalSkillLevels: number;

    trainSkill(skill: SkillType, skillPoints: number) : number {
        let delta = this.skills[skill].train(skillPoints);
        if (delta > 0) {
            // Announce the new skill level
            // TODO
            //this.game.skillSubject.next([skill, this.skills[skill].level]);

            let msg = "Increased " + SkillType[skill] + " to level " + this.skills[skill].level;
            //this.tickerService.logImportant(msg);
            let newTotal = this.totalSkillLevels + delta;
            let thresh = this.skillLevelsForNextLevel();
            while (newTotal >= thresh) {
                this.level++;
                //this.tickerService.logImportant(this.name + " reached level " + this.level + "!");
                newTotal -= thresh;
                thresh = this.skillLevelsForNextLevel();
                // TODO
                //this.game.levelSubject.next(this.level);
            }
            this.totalSkillLevels = newTotal;
        }
        return delta;
    }

    skillLevelsForNextLevel() : number {
        return Player.skillLevelsForNextLevel(this.level);
    }

    static skillLevelsForNextLevel(level: number) : number {
        return GLOBALS.playerLevelIncrement * level;
    }

    percentProgress() : number {
        return 100 * (this.totalSkillLevels / this.skillLevelsForNextLevel());
    }

}
