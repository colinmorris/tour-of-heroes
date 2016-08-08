import { Skill, skillMapFromFactory, SkillMapOf, SkillType } from '../../skills';
import { GLOBALS } from '../../globals';
import { Klass } from '../../klasses';
import { Perk, CLASS_PERKS } from '../../perks';

export class Player {
    constructor(
        public name: string,
        // Starts from 1 (unlike skills)
        public level: number,
        public klass: Klass,
        public skills: SkillMapOf<Skill>,
        public perks: Perk[]
    ) {
        this.totalSkillLevels = 0;
    }

    static newbornSkills(klass: Klass) {
        return skillMapFromFactory<Skill>(
            (s: SkillType) => {
                return new Skill(s, SkillType[s], 0, klass.aptitudes[s], 0);
            }
        );
    }

    static newborn(name: string, klass: Klass) {
        let perks: Perk[] = [];
        if (CLASS_PERKS[klass.name]) {
            perks.push(new CLASS_PERKS[klass.name]());
        } else {
            console.warn(`Couldn't find a perk for class ${klass.name}.`);
        }
        return new Player(name, 1, klass,
                             Player.newbornSkills(klass),
                             perks
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
