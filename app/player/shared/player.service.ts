import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { GLOBALS } from '../../globals';
import { KLASSES, Klass } from '../../klasses';
import { truthySkills, SkillType, SkillMap } from '../../skills';
import { LifetimeStats } from '../../stats';
import { Zone, ZoneAction } from '../../zones';
import { KickerPerk } from '../../perks';
import { Inventory } from '../../items';

import { Player } from './player.model';

/* This is basically the big-global-state-god-object-service (could probably
 * just as well be called 'PlayerService'). If you want to modify the Player
 * object, you should probably do it through this service. I mean, I should
 * probably enforce that by setting methods to private where appropriate.
 */
@Injectable()
export class PlayerService {
    chara: Player;
    levelSubject: BehaviorSubject<number>;
    // Skill type, skill level
    skillSubject: Subject<[SkillType,number]>;

    constructor(
    ) {
        // Apparently OnInit is supposed to be better, but it seems to lead
        // to weird race conditions in this case.
        let saved = localStorage.getItem(GLOBALS.localStorageToken);
        if (saved && GLOBALS.loadSaves) {
            console.log("Loading saved character data");
            // blah blah
            // this.chara = Player.deserialize(saved);
        } else {
            let defaultKlass: Klass = KLASSES[0];
            console.log("Creating new character");
            let newborn: Player = Player.newborn("Coolin", defaultKlass);
            this.chara = newborn;
        }
        this.skillSubject = new Subject<[SkillType,number]>();
        this.levelSubject = new BehaviorSubject<number>(this.chara.level);
        this.setupPerks();
    }

    // What does this do?
    setupPerks() {
        for (let perk of this.chara.perks) {
            console.log(`Setting up perk ${perk.name}`);
            perk.setup(this);
        }
    }

    reincarnate(klass: Klass) {
        for (let perk of this.chara.perks) {
            perk.teardown();
        }
        this.chara = Player.newborn(this.chara.name, klass);
    }

    // TODO: return number of points/levels gained
    trainSkill(skill: SkillType, points: number) : number {
        return this.chara.trainSkill(skill, points);
    }

    // ---- SAVING STUFF - to fix later ----
    saveState() {
        localStorage.setItem(GLOBALS.localStorageToken,
                             "foo" //this.player.serialize()
                            );
    }

    clearSave() {
        // Also reset state?
        localStorage.removeItem(GLOBALS.localStorageToken);
    }
}
