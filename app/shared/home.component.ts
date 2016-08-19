import { Component } from '@angular/core';

import { PlayerComponent } from '../player/player.component';
import { ZonesComponent } from '../zones/zones.component';
import { ZoneComponent } from '../zones/zone.component';

import { Zones } from '../zones/zones.service';

@Component({
    selector: 'home',
    directives: [PlayerComponent, ZonesComponent, ZoneComponent],
    template: `
    <div class="row">
        <div class="col-xs-3">
            <player-pane></player-pane>
        </div>
        <div class="col-xs-9">
            <zone *ngIf="zones.focalZone" [zone]="zones.focalZone"></zone>
            <zones></zones>
        </div>
    </div>
  `
})
export class HomeComponent {
    constructor(
        private zones: Zones
    ) {
    }
}
