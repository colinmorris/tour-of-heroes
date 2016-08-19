import { Component } from '@angular/core';

import { ActionService } from '../actions/action.service';
import { PerkService } from '../perks/perk.service';
import { PlayerService } from '../player/player.service';
import { LiveKlass, KlassService } from './klass.service';

import { SkillType } from '../core/index';

@Component({
    selector: 'klass-viewer',
    template: `
        <h1>klasses go here!</h1>
        <div class="row">

        <div class="col-xs-4">
        <div *ngIf="selected">
            <h2>{{selected.name}}</h2>
            Aptitudes:
            <ul>
                <li *ngFor="let apt of selected.aptitudes; let i = index">
                {{ST[i]}}: {{apt}}
                </li>
            </ul>
            Unlocked?: {{selected.unlocked}}
            <button (click)="reincarnate()">Reincarnate!</button>
        </div>
        </div>

        <div class="col-xs-8">
        <ul>
            <li *ngFor="let klass of KS.allKlasses">
                <a (click)="selected=klass">{{klass.name}}</a>
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

    reincarnate() {
        /** Reincarnation todo list:
        - stop any currently running actions
        - clear inventory
        - remove all buffs and perks
        - create a new player object, and assign it the appropriate perks
            - make sure there are no dangling references to the old player obj
            especially when it comes to observables
        */
        this.AS.stopAllActions();
        this.Perks.resetAllPerks();
        this.PS.reincarnate(this.selected.name);
        this.Perks.addPerkForKlass(this.selected.name);
        this.Perks.addAncestryPerk();
    }
}
