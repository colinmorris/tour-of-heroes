import { Component, OnInit } from '@angular/core';
import { Player } from './player';
import { PlayerService } from './player.service';
import { CharacterComponent } from './character.component';

import { ZoneService } from './zone.service';
import { ZonesComponent } from './zones.component';

import { TickerService } from './ticker.service';
import { TickerComponent } from './ticker.component';

@Component({
    selector: 'my-app',
    directives: [TickerComponent, CharacterComponent, ZonesComponent],
    template: `
    <player-pane></player-pane>
    <zones></zones>
    <ticker></ticker>
    <button (click)="playerService.saveState()">Save</button>
    <button (click)="playerService.clearSave()">Reset Save</button>
    <div class="reincarnate">
    </div>
  `,
  providers: [ZoneService, TickerService, PlayerService],
})

export class AppComponent implements OnInit {

    constructor(private zoneService: ZoneService, 
                private tickerService: TickerService,
                private playerService: PlayerService
               ) {}

    player : Player;

    ngOnInit() {
        this.player = this.playerService.player;
    }
}


