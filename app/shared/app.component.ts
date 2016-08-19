import { Component, OpaqueToken } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { PlayerService } from '../player/player.service';
import { Zones } from '../zones/zones.service';
import { ActionService } from '../actions/action.service';
import { KlassService } from '../klasses/klass.service';
import { PerkService } from '../perks/perk.service';
import { StatsService } from '../stats/stats.service';

import '../rxjs-operators';
import { di_tokens } from './di-tokens';


@Component({
    selector: 'my-app',
    directives: [ ROUTER_DIRECTIVES ],
    template: `
    <div class="container">
    <nav>
        <a [routerLink]="['/']">Home</a>
        <a [routerLink]="['/classes']">Classes</a>
        <a [routerLink]="['/stats']">Stats</a>
    </nav>
    <router-outlet></router-outlet>
    </div>
  `,
    providers: [Zones, KlassService, 
        StatsService,
        {provide: di_tokens.statsservice, useExisting: StatsService},
        PerkService,
        {provide: di_tokens.perkservice, useExisting: PerkService},
        PlayerService,
        {provide: di_tokens.playerservice, useExisting: PlayerService},
        ActionService,
        {provide: di_tokens.actionservice, useExisting: ActionService}
    ]
})

export class AppComponent {
}
