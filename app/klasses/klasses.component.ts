import { Component } from '@angular/core';

import { ActionService } from '../actions/action.service';
import { PerkService } from '../perks/perk.service';
import { PlayerService } from '../player/player.service';
import { LiveKlass, KlassService } from './klass.service';

import { SkillComponent } from '../shared/skill.component';

import { SkillType } from '../core/index';

@Component({
    selector: 'klass-viewer',
    directives: [SkillComponent],
    styles: [
        `.focal img {
            width: 216px;
        }
        img.locked {
            -webkit-filter: contrast(0);
        }
        ul {
            list-style: none;
        }
        `
    ],
    template: `
        <div class="row">

        <div class="col-xs-4">
        <div *ngIf="selected" class="focal">
            <h2>{{displayName(selected)}}</h2>
            <img [src]="'/assets/units/' + selected.img"
                [class.locked]="!selected.unlocked">
            Aptitudes:
            <ul>
                <li *ngFor="let apt of selected.aptitudes; let i = index">
                <skill [skill]="i"></skill>{{apt}}
                </li>
            </ul>
            <button *ngIf="selected.unlocked"
                class="btn"
                (click)="reincarnate()">
                    Reincarnate!
            </button>
        </div>
        </div>

        <div class="col-xs-8">
        <ul>
            <li *ngFor="let klass of KS.allKlasses">
                <img [src]="'/assets/units/' + klass.img"
                    [class.locked]="!klass.unlocked">
                <a (click)="selected=klass">{{displayName(klass)}}</a>
            </li>
        </ul>
        </div>

        </div>
    `
})
export class KlassesComponent {
    selected: LiveKlass;
    ST = SkillType;
    constructor (
        private KS: KlassService,
        private PS: PlayerService,
        private AS: ActionService,
        private Perks: PerkService
    ) {
    }

    displayName(klass: LiveKlass) {
        return klass.unlocked ? klass.name : "???";
    }

    reincarnate() {
        /** Reincarnation todo list:
        - stop any currently running actions
        - clear inventory
        - remove all buffs and perks
        - create a new player object and assign the appropriate perks (taken
            care of by player service)
        */
        this.AS.stopAllActions();
        this.Perks.resetAllPerks();
        this.PS.reincarnate(this.selected.name);
    }
}
