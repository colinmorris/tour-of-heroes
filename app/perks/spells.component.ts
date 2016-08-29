import { Component, OnInit } from '@angular/core';

import { PerkService } from './perk.service';
import { Spell, Buff, Passive } from './perk.interface';

@Component({
    selector: 'spell-bar',
    styles: [`

    `],
    template: `
    <div *ngFor="let spell of spells">
        <img src="/assets/spells/berserker_rage.png">
    </div>
    <svg>

        <g *ngFor="let spell of spells">

        <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="grad">
                <stop offset="0" stop-color="black"  />
                <stop [attr.offset]="spell.downtimePct()" stop-color="black" />
                <stop [attr.offset]="spell.downtimePct()" stop-color="white" />
                <stop offset="1" stop-color="white" />
            </linearGradient>
            <mask id="mymask">
            <rect
                x="0" y="0"
                width="64" height="64"
                fill="url(#grad)"
            ></rect>
            </mask>
        </defs>

        <rect
            x="0" y="0"
            width="70" height="70"
            fill="pink"
            rx="10"
            mask="url(#mymask)"
            (click)="spell.cast()"
        ><title>{{spell.name}}</title>
        </rect>

        <image
            x="100" y="0"
            width="64" height="64"
            mask="url(#mymask)"
            (click)="spell.cast()"
            xlink:href="/assets/spells/trog_berserk.png"
            />


        <text
            x="10" y="60"
            font-size="45"
            stroke="black"
            font-family="serif"
        >{{spell.name[0]}}</text>
        </g>
    </svg>
    `,
})
export class SpellsComponent {
    constructor(
        private Perks: PerkService
    ) {

    }

    get spells(): Spell[] {
        return this.Perks.getSpells();
    }
}
