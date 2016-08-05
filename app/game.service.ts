import { Injectable } from '@angular/core';
import { GLOBALS } from './globals';
import { Character } from './character';
import { KLASSES } from './klass.data';
import { Klass } from './klass';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { truthySkills, SkillType, SkillMap } from './skill';
import { LifetimeStats } from './stats';
import { ZoneAction, Outcome } from './zoneaction';
import { Zone } from './zone';
import { Kicker, KickerPerk } from './perk';
import { Inventory } from './inventory';
import { randomDrop } from './item';

/* This is basically the big-global-state-god-object-service (could probably
 * just as well be called 'GameService'). If you want to modify the Player
 * object, you should probably do it through this service. I mean, I should
 * probably enforce that by setting methods to private where appropriate.
 */
@Injectable()
export class GameService {
    chara: Character;
    levelSubject: BehaviorSubject<number>;
    // Skill type, skill level
    skillSubject: Subject<[SkillType,number]>;

    stats: LifetimeStats;
    inventory: Inventory;

    constructor(
    ) {
        // Apparently OnInit is supposed to be better, but it seems to lead
        // to weird race conditions in this case.
        let saved = localStorage.getItem(GLOBALS.localStorageToken);
        this.inventory = new Inventory();
        if (saved && GLOBALS.loadSaves) {
            console.log("Loading saved character data");
            // blah blah
            // this.chara = Player.deserialize(saved); 
        } else {
            let defaultKlass: Klass = KLASSES[0];
            console.log("Creating new character");
            let newborn: Character = Character.newborn("Coolin", defaultKlass, this);
            this.chara = newborn;
        }
        this.skillSubject = new Subject<[SkillType,number]>();
        this.levelSubject = new BehaviorSubject<number>(this.chara.level);
        this.stats = new LifetimeStats(this);
        this.setupPerks();
    }

    getKickers(zone: Zone, action: ZoneAction) : Kicker[] {
        let perkKickers: Kicker[] = KickerPerk.getKickers(this.chara, zone, action);
        if (Math.random() < GLOBALS.dropRate) {
            // random drop
            let dropKick : Kicker = randomDrop();
            perkKickers.push(dropKick);
        }
        return perkKickers;
    }

    applyOutcome(outcome: Outcome) {
        truthySkills(outcome.skillDelta,
                 (skill: SkillType, delta: number) => {
                     this.trainSkill(skill, delta);
                    });
        if (outcome.item) {
            this.inventory.addItem(outcome.item);
        }
    }

    applyOutcomes(outcomes: Outcome[]) {
        for (let outcome of outcomes) {
            this.applyOutcome(outcome);
        }
    }

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
        this.chara = Character.newborn(this.chara.name, klass, this);
    }

    // TODO: pointless?
    trainSkill(skill: SkillType, points: number) {
        this.chara.trainSkill(skill, points);
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

