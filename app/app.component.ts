import { Component } from '@angular/core';
import { HomeComponent } from './home.component';

import { PlayerService } from './player.service';

import { TickerService } from './ticker.service';
import { TickerComponent } from './ticker.component';

import { ActiveZoneService } from './activezone.service';

@Component({
    selector: 'my-app',
    directives: [TickerComponent, HomeComponent],
    template: `
    <home></home>
    <div class="row">
        <ticker></ticker>
        <button (click)="playerService.saveState()">Save</button>
        <button (click)="playerService.clearSave()">Reset Save</button>
    </div>
  `,
  providers: [TickerService, PlayerService, ActiveZoneService]
})

export class AppComponent {

}


