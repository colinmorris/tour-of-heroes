import { Injector, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PlayerService } from '../player/player.service';
import { ancestryBonusForLevel, ancestryBonus } from '../core/index';
import { IStatsService } from '../stats/stats.service.interface';
import { IPerkService } from './perk.service.interface';
import { AbstractBonus, AbstractSpell, AbstractTimedBuff,
    AbstractBuff, AbstractPassive } from './perk';
import { Spell, Passive, Buff, Bonus } from './perk.interface';
import { SPELLS } from './defns/spells.defns';
import { PASSIVES } from './defns/passives.defns';
import { BUFFS } from './defns/buffs.defns';

let deferral_time = 100; // idk

@Injectable()
export class PerkService implements IPerkService {
    private buffs: {[name:string]: Buff};
    private passives: {[name:string]: AbstractPassive};
    private spells: {[name:string]: AbstractSpell};
    constructor(
        private PS: PlayerService,
        private injector: Injector
    ) {
        this.resetAllPerks();
        this.addPerkForKlass(PS.player.klass, true);
        this.addAncestryPerk(true);
    }

    onReincarnate() {
        this.resetAllPerks();
    }
    postReincarnate() {
        this.addPerkForKlass(this.PS.player.klass);
        this.addAncestryPerk();
    }

    resetAllPerks() {
        /** Make sure buffs and passives clean up gracefully **/
        for (let buffname in this.buffs) {
            this.buffs[buffname].onDestroy();
        }
        for (let passiveName in this.passives) {
            this.passives[passiveName].onDestroy();
        }
        this.buffs = <{[n:string]:AbstractBuff}>{};
        this.passives = <{[n:string]:AbstractPassive}>{};
        this.spells = <{[n:string]:AbstractSpell}>{};
    }

    getSpells() : Spell[] {
        // Wait, really? I gotta do this?
        let res:Spell[] = new Array<Spell>();
        for (let name in this.spells) {
            res.push(this.spells[name]);
        }
        return res;
    }
    getPassives() : Passive[] {
        let res:Passive[] = new Array<Passive>();
        for (let name in this.passives) {
            res.push(this.passives[name]);
        }
        return res;
    }
    getBuffs() : Buff[] {
        let res:Buff[] = new Array<Buff>();
        for (let name in this.buffs) {
            res.push(this.buffs[name]);
        }
        return res;
    }
    perkForKlass(klass: string) : Bonus {
        let perkName = klass + 'Perk';
        if (perkName in SPELLS) {
            return SPELLS[perkName];
        } else if (perkName in PASSIVES) {
            let psv = PASSIVES[perkName];
            return psv;
        } else {
            console.warn(`Couldn't find a perk for ${klass}`);
        }
    }

    /** If defer is true, then wait a little bit before adding. This must be
    set if this is called from the constructor of a service, because running
    synchronously in that case will lead to a horrible infinite loop.
    (The timer-based solution is kind of a dumb hack. Should probably listen
    for an event fired when the app component is done loading. Or something.) **/
    addPerkForKlass(klass: string, defer=false) {
        /** TODO: this is very brittle. At the very least, should iterate through
        all known classes on initialization and assert that their corresponding
        perk exists. **/
        let perkName = klass + 'Perk';
        let add = () => {
            this.addPerkByName(perkName);
        }
        if (defer) {
            setTimeout(add, deferral_time);
        } else {
            add();
        }
    }

    addPerkByName(name: string) {
        if (name in SPELLS) {
            this.addSpell(name);
        } else if (name in PASSIVES) {
            this.addPassive(name);
        } else {
            console.warn(`Couldn't find perk with name ${name}`);
        }
    }

    addAncestryPerk(defer=false) {
        if (defer) {
            setTimeout(() => this.inner_addAncestryPerk(), deferral_time);
        } else {
            this.inner_addAncestryPerk();
        }
    }
    private inner_addAncestryPerk() {
        let ancestry = new PASSIVES.AncestryPerk(this.injector);
        let success = ancestry.apply();
        if (!success) {
            console.log("Not eligible for ancestry perk yet.");
        } else {
            this.passives["AncestryPerk"] = ancestry;
        }
    }
    ancestryBonusForLevel(level: number) {
        return ancestryBonusForLevel(level);
    }
    ancestryBonus(stats: IStatsService) {
        return ancestryBonus(stats.maxLevels());
    }
    ancestryBonusWithSub(stats: IStatsService, subklass: string, level: number) {
        let maxLevels:number[] = new Array<number>();
        maxLevels.push(level);
        let perKlass = stats.maxLevelPerKlass();
        for (let klass in perKlass) {
            // Ignore any previous max level for the given class
            if (klass != subklass) {
                maxLevels.push(perKlass[klass]);
            }
        }
        return ancestryBonus(maxLevels);
    }

    private addSpell(spellName: string) {
        console.assert(!(spellName in this.spells));
        let spell:AbstractSpell = new SPELLS[spellName](this.injector);
        this.spells[spellName] = spell;
    }

    private addPassive(passiveName: string) {
        console.assert(!(passiveName in this.passives));
        let passive:AbstractPassive = new PASSIVES[passiveName](this.injector);
        this.passives[passiveName] = passive;
        passive.apply();
    }

    /** TODO: I think this refactor to allow passing in additional constructor
    arguments was actually unnecessary. The thing that needs to add the buff
    (the passive, spell, item, whatever) should know which buff class it
    needs specifically, and just call some factory method of that class.
    */
    public addBuff(buffName: string, ...buffArgs: any[]) {
        let buff:AbstractBuff = new BUFFS[buffName](this.injector, ...buffArgs);
        this.addBuffObject(buff);
    }
    /** If we're given a dupe of a currently-active buff, we'll refresh the
    duration, but not add a new instance of the buff.
    **/
    public addBuffObject(buff: Buff) {
        let buffid = buff.name;
        if (buffid in this.buffs) {
            this.buffs[buffid].refresh(buff);
        } else {
            this.buffs[buffid] = buff;
            buff.apply().then( (resolved) => {
                delete this.buffs[buffid];
            });
        }
    }

}
