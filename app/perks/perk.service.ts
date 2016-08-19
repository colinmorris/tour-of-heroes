import { Injector, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPerkService } from './perk.service.interface';
import { AbstractBonus, AbstractSpell, AbstractTimedBuff,
    AbstractBuff, AbstractPassive } from './perk';
import { Spell, Passive, Buff } from './perk.interface';
import { SPELLS } from './defns/spells.defns';
import { PASSIVES } from './defns/passives.defns';
import { BUFFS } from './defns/buffs.defns';

let deferral_time = 100; // idk

@Injectable()
export class PerkService implements IPerkService {
    private buffs: {[name:string]: AbstractBuff};
    private passives: {[name:string]: AbstractPassive};
    private spells: {[name:string]: AbstractSpell};
    constructor(
        private injector: Injector
    ) {
        this.resetAllPerks();
    }

    resetAllPerks() {
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

    /** If defer is true, then wait a little bit before adding. This must be
    set if this is called from the constructor of a service, because running
    synchronously in that case will lead to a horrible infinite loop.
    (The timer-based solution is kind of a dumb hack. Should probably listen
    for an event fired when the app component is done loading. Or something.) **/
    addPerkForKlass(klass: string, defer=false) {
        // TODO: should call out to klassService to get the right perk?
        console.log(`Adding a perk for ${klass}`);
        let add = () => {
            this.addSpell("Execute");
            this.addSpell("Berserk");
            this.addPerkByName("PeasantPerk");
        }
        if (defer) {
            setTimeout(add, deferral_time);
        } else {
            add();
        }
    }

    addPerkByName(name: string) {
        // TODO: Bleh, it's totally possible for a name to be shared between two
        // of these categories, even intentionally (e.g. "Berserk"). Should probably
        // do some kind of namespacing.
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
    // grumble
    public addBuff(buffName: string, duration?: number) {
        // TODO: maybe want to allow buff duplicates? in which case this is a bad idea
        let buff:AbstractBuff = new BUFFS[buffName](this.injector);
        if (duration) {
            console.assert(buff instanceof AbstractTimedBuff);
            (<AbstractTimedBuff>buff).duration = duration;
        }
        this.buffs[buff.name] = buff;
        buff.apply().then( () => {
            delete this.buffs[buff.name];
        });
    }

}
