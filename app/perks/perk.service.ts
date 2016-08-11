import { Injector, Injectable } from '@angular/core';

import { Spell, Execute } from './spell.data';

@Injectable()
export class PerkService {
    private spells: Spell[] = [];
    constructor(
        private injector: Injector
    ) {

    }

    getSpells() {
        return this.spells;
    }

    addPerkForKlass(klass: string) {
        console.log(`Adding a perk for ${klass}`);
        let spell: Spell = new Execute(this.injector);
        this.spells.push(spell);
    }

}
