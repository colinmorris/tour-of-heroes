import { Component, OpaqueToken } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import '../rxjs-operators';

import { PlayerService } from '../player/player.service';
import { Zones } from '../zones/zones.service';
import { ActionService } from '../actions/action.service';
import { KlassService } from '../klasses/klass.service';
import { PerkService } from '../perks/perk.service';

//import { TickerService, TickerComponent } from '../ticker/index';

//import { ActiveZoneService, ActionService } from '../zones';
import { KlassesComponent } from '../klasses/klasses.component';
//import { KlassesService } from '../klasses/klasses.service';
//import { InventoryService } from '../items';

import { StatsComponent } from '../stats/stats.component';
//import { StatsService } from '../stats/stats.service';
import { HomeComponent } from './home.component';
import { actionToken } from '../globals';


@Component({
    selector: 'my-app',
    directives: [HomeComponent, KlassesComponent, StatsComponent,
        ROUTER_DIRECTIVES
    ],
    // TODO: Should probably bring the router stuff back. It's true that I probably want
    // to always have the zones component live because there's sort of the expectation that
    // actions will continue to run in the background even when navigating to other tabs,
    // but the other tabs aren't so stateful, so we can page them in and out on demand.
    // And actually, even keeping the zones component alive is maybe not a necessity with
    // good use of services.
    template: `
    <nav>
        <a [routerLink]="['/explore']">Home</a>
        <a [routerLink]="['/classes']">Classes</a>
        <a [routerLink]="['/stats']">Stats</a>
    </nav>
    <div class="row">
        <ticker></ticker>
    </div>
    <router-outlet></router-outlet>
    <div class="row">
        <button>Save</button>
        <button>Reset Save</button>
    </div>
  `,
    providers: [Zones, PlayerService, KlassService, PerkService,
        {provide: actionToken, useClass: ActionService}
    ]
//  providers: [TickerService, PlayerService, ActiveZoneService, InventoryService, // <- no deps
  //    StatsService, KlassesService, ActionService]
})

export class AppComponent {
}
