import { skillMapFromFactory, SkillMapOf, Skill, SkillType } from './skill';
import { TickerService } from './ticker.service';
import { GLOBALS } from './globals';
import { Klass } from './klass';
import { Perk } from './perk';

export class Player {
    skills: SkillMapOf<Skill>;
    perks: Perk[];
    // TODO: this whole constructor is pretty dumb 
    constructor(
        public name: string,
        // Starts from 1 (unlike skills)
        public level: number,
        public klass: Klass,
        // TODO: this is dumb. This shouldn't be here.
        public tickerService: TickerService
    ) {
        this.skills = skillMapFromFactory<Skill>(
            (s: number) => { return new Skill(s, SkillType[s], 0, 1.0, 0); }
        );
        this.totalSkillLevels = 0;
        this.tickerService = tickerService;
    }

    private totalSkillLevels: number;

    canReincarnate() : boolean { return true; }

    // This needs to have some preeeetty drastic global effects. For example, should
    // kill the current action, reset the 'map'... anything else? Need to set up some
    // way of communicating this to components.
    reincarnate(newKlass: Klass) {

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

    trainSkill(skill: SkillType, skillPoints: number) {
        let delta = this.skills[skill].train(skillPoints);
        if (delta > 0) {
            let msg = "Increased " + SkillType[skill] + " to level " + this.skills[skill].level;
            this.tickerService.logImportant(msg);
            let newTotal = this.totalSkillLevels + delta;
            let thresh = this.skillLevelsForNextLevel();
            while (newTotal >= thresh) {
                this.level++;
                this.tickerService.logImportant(this.name + " reached level " + this.level + "!");
                newTotal -= thresh;
                thresh = this.skillLevelsForNextLevel();
            }
            this.totalSkillLevels = newTotal;
        }
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

    serialize() : string { 
        // Basically every attribute should be saved except for the ticker service
        // because it's got cyclical references and who needs it
        let twin = Object.assign({}, this);
        delete twin.tickerService;
        return JSON.stringify(twin);
        
    }

}

