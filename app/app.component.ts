import { Component } from '@angular/core';
import { Player } from './player';
import { PlayerService } from './player.service';
import { CharacterComponent } from './character.component';

import { ZonesComponent } from './zones.component';

import { TickerService } from './ticker.service';
import { TickerComponent } from './ticker.component';

@Component({
    selector: 'my-app',
    directives: [TickerComponent, CharacterComponent, ZonesComponent],
    template: `
    <div class="row">
        <div class="col-xs-6">
            <player-pane></player-pane>
        </div>
        <div class="col-xs-6">
            <zones></zones>
        </div>
    </div>
    <div class="row">
        <ticker></ticker>
        <button (click)="playerService.saveState()">Save</button>
        <button (click)="playerService.clearSave()">Reset Save</button>
    </div>
  `,
  providers: [TickerService, PlayerService],
})

export class AppComponent {

}


