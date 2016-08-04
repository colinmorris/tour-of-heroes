import { Component, OnInit, OnDestroy } from '@angular/core';

import { CharacterComponent } from './character.component';
import { ZonesComponent } from './zones.component';
import { SUPERZONES } from './zones.data';

@Component({
    selector: 'home',
    directives: [CharacterComponent, ZonesComponent],
    template: `
    <div class="row">
        <div class="col-xs-6">
            <player-pane></player-pane>
        </div>
        <div class="col-xs-6">
            <nav>
                <a *ngFor="let super of superzones" (click)="superzone=super">{{super}}</a>
            </nav>
            <zones *ngFor="let super of superzones" [superzone]="super" [hidden]="super != superzone"></zones>
        </div>
    </div>
  `
})
export class HomeComponent implements OnInit, OnDestroy {

    superzone: string = 'fields';
    superzones: string[] = SUPERZONES;
    constructor(
    ) {}

    ngOnInit() {
    }

    ngOnDestroy() {
    }
}
