import { Component, OnInit } from '@angular/core';

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
        (click)="spell.cast()"
        >{{spell.name}} {{cooldownString(spell)}}</button>
    </div>
    `,
})
export class SpellsComponent {
    constructor(
        private Perks: PerkService
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

    get spells(): Spell[] {
        return this.Perks.getSpells();
    }
}
