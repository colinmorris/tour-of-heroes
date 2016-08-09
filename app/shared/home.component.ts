import { Component } from '@angular/core';

import { PlayerComponent } from '../player/player.component';
import { ZonesComponent } from '../zones/zones.component';

@Component({
    selector: 'home',
    directives: [PlayerComponent, ZonesComponent],
    template: `
    <div class="row">
        <div class="col-xs-3">
            <player-pane></player-pane>
        </div>
        <div class="col-xs-9">
            <zones></zones>
        </div>
    </div>
  `
})
export class HomeComponent {

    constructor(
    ) {}

}
