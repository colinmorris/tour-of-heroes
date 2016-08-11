import { Component, OnInit } from '@angular/core';

import { PerkService } from './perk.service';
import { Spell } from './spell.data';

@Component({
    selector: 'perks',
    template: `
    <h2>Here are some perks</h2>

    <div class="spells">
        <a *ngFor="let spell of spells"
            (click)="spell.cast()">{{spell.name}}</a>
    </div>

    <div class="buffs">

    </div>

    <div class="perks">

    </div>
    `
})
export class PerksComponent implements OnInit {
    spells: Spell[];
    constructor(
        private PRKS: PerkService
    ) {

    }

    ngOnInit () {
        this.spells = this.PRKS.getSpells();
    }

    cast(spell: string) {

    }
}
