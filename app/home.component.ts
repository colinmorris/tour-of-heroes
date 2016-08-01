import { Component } from '@angular/core';

import { CharacterComponent } from './character.component';
import { ZonesComponent } from './zones.component';

@Component({
    selector: 'home',
    directives: [CharacterComponent, ZonesComponent],
    template: `
    <div class="row">
        <div class="col-xs-6">
            <player-pane></player-pane>
        </div>
        <div class="col-xs-6">
            <zones></zones>
        </div>
    </div>
  `
})
export class HomeComponent {

}
