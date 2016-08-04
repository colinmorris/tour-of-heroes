import { Component } from '@angular/core';

import { GameService } from './game.service';

import { TickerService } from './ticker.service';
import { TickerComponent } from './ticker.component';

import { ActiveZoneService } from './activezone.service';
import { KlassesService } from './klasses.service';

import { HomeComponent } from './home.component';
import { KlassesComponent } from './klasses.component';
import { StatsComponent } from './stats.component';


@Component({
    selector: 'my-app',
    directives: [HomeComponent, KlassesComponent, TickerComponent, StatsComponent],
    // TODO: Should probably bring the router stuff back. It's true that I probably want
    // to always have the zones component live because there's sort of the expectation that
    // actions will continue to run in the background even when navigating to other tabs,
    // but the other tabs aren't so stateful, so we can page them in and out on demand.
    template: `
    <nav>
        <a (click)="view='home'">Home</a>
        <a (click)="view='klasses'">Classes</a>
        <a (click)="view='stats'">Stats</a>
    </nav>
    <home [hidden]="view != 'home'"></home>
    <klass-viewer [hidden]="view != 'klasses'"></klass-viewer>
    <stats [hidden]="view != 'stats'"></stats>
    <div class="row">
        <ticker></ticker>
        <button (click)="gameService.saveState()">Save</button>
        <button (click)="gameService.clearSave()">Reset Save</button>
    </div>
  `,
  providers: [TickerService, GameService, ActiveZoneService, KlassesService]
})

export class AppComponent {
    view: string = "home";

    constructor(private gameService: GameService) {}
}


