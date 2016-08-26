import { Component, OpaqueToken, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PlayerService } from '../player/player.service';
import { Zones } from '../zones/zones.service';
import { ActionService } from '../actions/action.service';
import { KlassService } from '../klasses/klass.service';
import { PerkService } from '../perks/perk.service';
import { StatsService } from '../stats/stats.service';
import { SerializationService } from './serialization.service';

import '../rxjs-operators';
import { di_tokens } from './di-tokens';
import { GLOBALS } from '../globals';

@Component({
    selector: 'my-app',
    directives: [ ROUTER_DIRECTIVES ],
    styles: [`
        .save {
            margin-top: 15px;
        }
    `],
    template: `
    <simple-notifications></simple-notifications>
    <div class="container">
    <nav>
        <a [routerLink]="['/']">Home</a>
        <a [routerLink]="['/classes']">Classes</a>
        <a [routerLink]="['/stats']">Stats</a>
    </nav>
    <router-outlet></router-outlet>
    <div class="row save">
    <button (click)="serials.save()">Save</button>
    <button (click)="serials.clearSave()">Clear Save</button>
    </div>
    </div>
  `,
    providers: [Zones, KlassService, SerializationService,
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

export class AppComponent implements OnInit {
    constructor(
        private serials: SerializationService
    ) {

    }

    ngOnInit() {
        if (GLOBALS.autoSave) {
            Observable.interval(GLOBALS.autoSaveIntervalMs).subscribe( () => {
                console.log("Auto-saving");
                this.serials.save();
            });
        }

    }
}
