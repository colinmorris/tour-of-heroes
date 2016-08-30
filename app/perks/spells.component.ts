import { Component, OnInit } from '@angular/core';

import { StatsService } from '../stats/stats.service';
import { PerkService } from './perk.service';
import { Spell, Buff, Passive } from './perk.interface';

@Component({
    selector: 'spell-bar',
    styles: [`
        button {
            float: right;
        }

    `],
    template: `
    <div *ngFor="let spell of spells">
        <button class="btn btn-warning"
        [title]="spell.description"
        [class.disabled]="spell.remainingCooldown > 0"
        (click)="cast(spell)"
        >{{spell.name}} {{cooldownString(spell)}}</button>
    </div>
    `,
})
export class SpellsComponent {
    constructor(
        private Perks: PerkService,
        private Stats: StatsService
    ) {

    }

    cooldownString(spell: Spell) {
        let cd = spell.remainingCooldown;
        if (cd && cd > 0) {
            return `(${Math.ceil(cd / 1000)})`;
        } else {
            return "";
        }
    }

    cast(spell: Spell) {
        let success = spell.cast();
        if (success) {
            this.Stats.spellCast();
        }
    }

    get spells(): Spell[] {
        return this.Perks.getSpells();
    }
}
