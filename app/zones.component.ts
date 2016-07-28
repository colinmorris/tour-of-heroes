import { Component, OnInit } from '@angular/core';

import { TickerService } from './ticker.service';

import { Zone } from './zone';
import { ZoneAction } from './zoneaction';
import { ZoneComponent } from './zone.component';
import { ZONES } from './zones.data';

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
            <zone [zone]="zone" [active]="zone == activeZone"></zone>
        </div>
    </div>
    `
})

export class ZonesComponent implements OnInit {
    zones : Zone[] = ZONES;
    activeZone: Zone;
    player : Player;

    private actionTimer : number;
    private currentAction : ZoneAction;
    
    constructor(private playerService: PlayerService,
        private tickerService: TickerService
    ) {
        this.player = playerService.player;
    }
    
    ngOnInit() {
        this.setActiveZone(this.zones[0]);
    }

    killCurrentAction() {
        // TODO
    }
    
    setActiveZone(zone: Zone) {
        if (zone === this.activeZone) {
            console.log("Ignoring no-op zone change.");
            return;
        }
        if (this.actionTimer) {
            this.killCurrentAction();
        }
        this.activeZone = zone;
        this.queueAction();
    }

    queueAction() {
        this.currentAction = this.activeZone.getAction();
        // TODO: Timer type shenanigans
        this.actionTimer = window.setTimeout(
            () => {
                this.currentAction.effect(this.player);
                this.currentAction.broadcast(this.tickerService);
                this.queueAction();

            },
            this.currentAction.delay(this.player)
        );
    }
}

