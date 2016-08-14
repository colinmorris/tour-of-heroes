import { Component, OnInit } from '@angular/core';

import { PerkService } from './perk.service';
import { Spell, Buff, Passive } from './perk.interface';

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
        <div *ngFor="let passive of passives">
            {{passive.name}}: <b>{{passive.description}}</b>
        </div>
    </div>
    `
})
export class PerksComponent implements OnInit {
    constructor(
        private PRKS: PerkService
    ) {

    }

    ngOnInit () {
    }

    get spells(): Spell[] {
        return this.PRKS.getSpells();
    }
    get buffs(): Buff[] {
        return this.PRKS.getBuffs();
    }
    get passives(): Passive[] {
        return this.PRKS.getPassives();
    }

}
