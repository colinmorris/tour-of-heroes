import { Component } from '@angular/core';

import { ActiveZoneService } from './activezone.service';
import { PlayerService } from './player.service';
import { Player } from './player';

import { KLASSES } from './klass.data';
import { Klass } from './klass';

@Component({
    selector: 'klass-viewer',
    directives: [],
    template: `
    <ul>
        <li *ngFor="let klass of klasses">
            <a (click)="selected=klass">{{ klass.name }}</a>
        </li>
    </ul>
    <button [disabled]="!selected" (click)="reincarnate()">Reincarnate!</button>
    `
})
export class KlassesComponent {

    klasses: Klass[];
    player: Player;
    selected: Klass;
    
    constructor(private playerService: PlayerService,
                private azService: ActiveZoneService       
                ) {
        this.klasses = KLASSES;
        this.player = playerService.player;
    }

    reincarnate() {
        this.azService.resetActiveZone();
        console.log("You reincarnated as a " + this.selected.name + ". yay");
        this.player.reincarnate(this.selected);
    }
}
