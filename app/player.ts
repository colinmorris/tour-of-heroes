import { skillMapFromFactory, SkillMapOf, Skill, SkillType } from './skill';
import { GLOBALS } from './globals';
import { Klass } from './klass';
import { Perk, CLASS_PERKS } from './perk';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class Character {
    levelSubject: BehaviorSubject<number>;
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
        return new Character(name, 1, klass, 
                             Character.newbornSkills(klass),
                             perks
                            );
    }

    private totalSkillLevels: number;
    
    trainSkill(skill: SkillType, skillPoints: number) {
        let delta = this.skills[skill].train(skillPoints);
        if (delta > 0) {
            let msg = "Increased " + SkillType[skill] + " to level " + this.skills[skill].level;
            //this.tickerService.logImportant(msg);
            let newTotal = this.totalSkillLevels + delta;
            let thresh = this.skillLevelsForNextLevel();
            while (newTotal >= thresh) {
                this.level++;
                //this.tickerService.logImportant(this.name + " reached level " + this.level + "!");
                newTotal -= thresh;
                thresh = this.skillLevelsForNextLevel();
                this.levelSubject.next(this.level);
            }
            this.totalSkillLevels = newTotal;
        }
    }

    skillLevelsForNextLevel() : number {
        return Character.skillLevelsForNextLevel(this.level);
    }

    static skillLevelsForNextLevel(level: number) : number {
        return GLOBALS.playerLevelIncrement * level;
    }

    percentProgress() : number {
        return 100 * (this.totalSkillLevels / this.skillLevelsForNextLevel());
    }

}

// TODO: Separation of concerns btwn "Player" and "Character" not really well
// defined at this point. Not rly clear why "Player" needs to exist.
export class Player {
    constructor(
        public character: Character
        ) {
        }

    canReincarnate() : boolean { return true; }

    reincarnate(newKlass: Klass) {
        for (let perk of this.character.perks) {
            perk.teardown();
        }
        this.character = Character.newborn(this.character.name, newKlass);
    }

    get skills() : SkillMapOf<Skill> {
        return this.character.skills;
    }






    static deserialize(saveString) : Player {
        // TODO FIXME
        // This feels like it should be less awkward
        let obj = JSON.parse(saveString);
        /**
        let p = new Player(
            obj.name,
            obj.level,
            obj.klass,
            null);
        p.skills = new Array(SkillType.MAX);
        for (let s=0; s < SkillType.MAX; s++) { 
            let fake = obj.skills[s];
            p.skills[s] = new Skill(fake.id, fake.name, fake.level, fake.aptitude, fake.skillPoints);
        }
        return p;
        */
       return undefined;
    }


    serialize() : string { 
        // Basically every attribute should be saved except for the ticker service
        // because it's got cyclical references and who needs it
        let twin = Object.assign({}, this);
        //delete twin.tickerService;
        return JSON.stringify(twin);
        
    }

}

