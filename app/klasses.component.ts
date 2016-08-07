import { Component } from '@angular/core';

import { ActiveZoneService } from './activezone.service';
import { PlayerService } from './player.service';

import { KLASSES } from './klass.data';
import { Klass } from './klass';
import { KlassesService } from './klasses.service';

@Component({
    selector: 'klass-viewer',
    directives: [],
    styles: [`
        .locked {
            color: grey;
        }`],
    template: `
    <ul>
        <li *ngFor="let klass of klasses">
            <a (click)="selected=klass" [class.locked]="!klass.unlocked">{{ klass.name }}</a>
        </li>
    </ul>
    <button [disabled]="!selected" (click)="reincarnate()">Reincarnate!</button>
    `
})
export class KlassesComponent {

    klasses: Klass[];
    selected: Klass;
    
    constructor(private gameService: PlayerService,
                private azService: ActiveZoneService,
                private ks: KlassesService
                ) {
        this.klasses = KLASSES;
    }

    reincarnate() {
        this.azService.resetActiveZone();
        console.log("You reincarnated as a " + this.selected.name + ". yay");
        this.gameService.reincarnate(this.selected);
    }
}
