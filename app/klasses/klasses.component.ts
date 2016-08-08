import { Component, Inject, forwardRef } from '@angular/core';

import { ActiveZoneService } from '../zones';
import { PlayerService } from '../player';

import { KLASSES } from './klass.data';
import { Klass } from './klass.model';
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
    
    constructor(
                private ks: KlassesService,
                @Inject(forwardRef(() => PlayerService)) private gameService: PlayerService,
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
