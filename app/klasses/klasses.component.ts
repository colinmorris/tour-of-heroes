import { Component } from '@angular/core';

import { ActionService } from '../actions/action.service';
import { PerkService } from '../perks/perk.service';
import { PlayerService } from '../player/player.service';
import { KlassService } from './klass.service';

@Component({
    selector: 'klass-viewer',
    template: `
        <h1>klasses go here!</h1>
        <ul>
            <li *ngFor="let klass of KS.allKlasses">
                <a (click)="selected=klass.name">{{klass.name}}</a>
            </li>
        </ul>
        <b>Selected:</b> {{selected}}
        <button (click)="reincarnate()">Reincarnate!</button>
    `
})
export class KlassesComponent {
    selected: string;
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
        this.PS.reincarnate(this.selected);
        this.Perks.addPerkForKlass(this.selected);
    }
}
