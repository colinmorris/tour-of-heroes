import { Component, OnInit } from '@angular/core';

import { TickerService } from './ticker.service';

import { Zone } from './zone';
import { ZoneAction } from './zoneaction';
import { ZoneComponent } from './zone.component';
import { ZONES } from './zones.data';
import { ActiveZoneService } from './activezone.service';

import { Skill, SkillType } from './skill';

import { GLOBALS } from './globals';
import { Player } from './player';
import { PlayerService } from './player.service';

@Component({
    selector: 'zones',
    directives: [ZoneComponent],
    template: `
    <div class="zones">
        <div *ngFor="let zone of zones">
            <zone 
                [zone]="zone" 
                >
            </zone>
        </div>
    </div>
    `,
    providers: [ActiveZoneService]
})

export class ZonesComponent implements OnInit {
    zones : Zone[] = ZONES;
    player : Player;

    private currentAction : ZoneAction;
    
    constructor(private playerService: PlayerService,
        private tickerService: TickerService
    ) {
        this.player = playerService.player;
    }
    
    ngOnInit() {
    }

}

