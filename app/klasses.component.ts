import { Component } from '@angular/core';

import { ActiveZoneService } from './activezone.service';
import { GameService } from './game.service';

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
    selected: Klass;
    
    constructor(private gameService: GameService,
                private azService: ActiveZoneService       
                ) {
        this.klasses = KLASSES;
    }

    reincarnate() {
        this.azService.resetActiveZone();
        console.log("You reincarnated as a " + this.selected.name + ". yay");
        this.gameService.reincarnate(this.selected);
    }
}
