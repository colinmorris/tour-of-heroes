import { Component } from '@angular/core';

import { PlayerService } from '../player';

import { TickerService, TickerComponent } from '../ticker';

import { ActiveZoneService, ActionService } from '../zones';
import { KlassesService, KlassesComponent } from '../klasses';
import { InventoryService } from '../items';
import { StatsService, StatsComponent } from '../stats';

import { HomeComponent } from './home.component';


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
    <div class="row">
        <ticker></ticker>
    </div>
    <home [hidden]="view != 'home'"></home>
    <klass-viewer [hidden]="view != 'klasses'"></klass-viewer>
    <stats [hidden]="view != 'stats'"></stats>
    <div class="row">
        <button (click)="gameService.saveState()">Save</button>
        <button (click)="gameService.clearSave()">Reset Save</button>
    </div>
  `,
  providers: [TickerService, PlayerService, ActiveZoneService, InventoryService, // <- no deps
      StatsService, KlassesService, ActionService]
})

export class AppComponent {
    view: string = "home";
}
