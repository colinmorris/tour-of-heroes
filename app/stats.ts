import { SkillMap, SkillType, uniformSkillMap } from './skill';
import { GameService } from './game.service';
import { KLASSES } from './klass.data';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/** What kinds of stats would one want to keep track of? Basically anything that
 * can be used as unlock criteria for classes (and maybe other unlockables). Namely...
 *  (maxes unless otherwise specified)...
 *
 * - skill level reached per skill
 * - plvl reached per class
 * - actions spent per zone
 * - actions spent per skill
 * - 
 *
 * (Should maybe just fill this in opportunistically as actual unlockables are added?)
 */

export class LifetimeStats {
    // Does this work? Is this a reasonable thing to do? IDK.
    subject: BehaviorSubject<LifetimeStats>;
    private _actionsThisLifetime:number = 0;
    // Max actions taken across lifetimes
    actionsTaken = 0;
    constructor(
        private game: GameService
    ){ 
        this.maxPlayerLevel = <{string: number}>{};
        for (let klass of KLASSES) {
            this.maxPlayerLevel[klass.name] = game.chara.klass.name == klass.name ? 1 : 0;
        }

        this.subject = new BehaviorSubject<LifetimeStats>(this);
        game.levelSubject.subscribe(
            (level:number) => { this.onLevelChange(level); }
        );
        this.maxSkillLevel = uniformSkillMap<number>(0);
        game.skillSubject.subscribe(
            (tup:[SkillType,number]) => { this.onSkillLevelChange(tup); }
        );
    }
    // Max level attained per skill
    maxSkillLevel: SkillMap;
    // Max player level attained per class
    maxPlayerLevel: {string: number};

    set actionsTakenThisLifetime(nactions: number) {
        this._actionsThisLifetime = nactions;
        if (nactions > this.actionsTaken) {
            this.actionsTaken = nactions;
            this.subject.next(this);
        }
    }
    get actionsTakenThisLifetime() { return this._actionsThisLifetime; }

    onLevelChange(level: number) {
        let klass: string = this.game.chara.klass.name;
        if (level > this.maxPlayerLevel[klass]) {
            this.maxPlayerLevel[klass] = level;
            this.subject.next(this);
        }
    }

    onSkillLevelChange(tup: [SkillType, number]) {
        let skill: SkillType = tup[0];
        let level: number = tup[1];
        if (level > this.maxSkillLevel[skill]) {
            this.maxSkillLevel[skill] = level;
            this.subject.next(this);
        }
    }

}
