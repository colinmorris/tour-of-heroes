import { Component, OnInit } from '@angular/core';

import { TickerService } from './ticker.service';

import { Zone } from './zone';
import { ZoneComponent } from './zone.component';

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
            <zone [zone]="zone"></zone>
        </div>
    </div>
    `
})

export class ZonesComponent implements OnInit {
    zones : Zone[] = ZONES;
    activeZone: Zone;
    player : Player;
    
    constructor(private playerService: PlayerService,
        private tickerService: TickerService
    ) {
        this.player = playerService.player;
    }
    
    ngOnInit() {
        this.setActiveZone(this.zones[0]);
    }
    
    setActiveZone(zone: Zone) {
        if (zone === this.activeZone) {
            console.log("Ignoring no-op zone change.");
            return;
        }
        this.activeZone = zone;
        let intervalId = setInterval(
            () => {
                this.takeAction();
            },
            GLOBALS.timestep_ms
        );
    }

    takeAction() {
        // choose which skill to train
        let skillDelta = this.activeZone.chooseSkillUp();
        // add skill points
        this.player.trainSkill(skillDelta[0], skillDelta[1]);
        // record the event
        // spammy
        //this.tickerService.log("Increased skill " + SkillType[skillDelta[0]] + " by " + skillDelta[1] + " points.");
    }
}

const ZONES: Zone[] = [
    new Zone('Turnip Fields', 'mm turnips', 'farm', [1,0,0,0]),
    new Zone('The Woods', 'Trees yay', 'chop', [0,0.1,0.9,0]),
];
