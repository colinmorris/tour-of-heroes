import { Component, OnInit, OnDestroy } from '@angular/core';

import { PlayerComponent } from '../player';
import { ZonesComponent, SUPERZONES } from '../zones';

@Component({
    selector: 'home',
    directives: [PlayerComponent, ZonesComponent],
    template: `
    <div class="row">
        <div class="col-xs-3">
            <player-pane></player-pane>
        </div>
        <div class="col-xs-9">
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
