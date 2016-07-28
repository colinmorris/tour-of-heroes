import { Component, OnInit } from '@angular/core';
import { GLOBALS } from './globals';
import { Player } from './player';
import { Skill, SkillType } from './skill';

import { GameZone } from './zone';
import { GameZoneService } from './zone.service';

import { TickerService } from './ticker.service';
import { TickerComponent } from './ticker.component';

/* TODO: Of course this should all be refactored into multiple components,
 * using services, etc. But let's get this thing off the ground first.
 */
@Component({
    selector: 'my-app',
    directives: [TickerComponent],
    template: `
    <div class="player-info" *ngIf="playerLoaded">

    <h2>{{player.name}}, the level {{player.level}} {{player.klass}}</h2>
    Level progress: 
    <div class="progress">
        <div class="progress-bar" [style.width.%]="player.percentProgress()">
        </div>
        {{player.totalSkillLevels}} / {{player.skillLevelsForNextLevel()}}
    </div>

    <ul>
        <li *ngFor="let skill of player.skills">
            <b>{{skill.name}}</b>
            Level {{skill.level}} (apt={{skill.aptitude}})
            <div class="progress">
                <div id="pbar{{skill.id}}" class="progress-bar" [style.width.%]="skill.percentProgress()"></div>{{skill.skillPoints}} / {{skill.pointsForNextLevel()}}
            </div>
        </li>
    </ul>
    </div> <!-- /player-info div -->

    <div class="zones">
        <div *ngFor="let zone of zones">
            <h3>{{zone.name}}</h3>
            <p>{{zone.description}}</p>
            <button>{{zone.action}}</button>
        </div>
    </div>

    <ticker></ticker>

    <button (click)="saveState()">Save</button>
    <button (click)="clearSave()">Reset Save</button>
    <div class="reincarnate">
    </div>
  `,
  providers: [GameZoneService, TickerService],
})

export class AppComponent implements OnInit {

    constructor(private zoneService: GameZoneService, private tickerService: TickerService) {}

    player : Player;
    zones : GameZone[] = ZONES;
    private activeGameZone : GameZone;
    private playerLoaded = false;

    ngOnInit() {
        let saved = localStorage.getItem(GLOBALS.localStorageToken);
        if (saved) {
            console.log("Back from the dead");
            this.player = Player.deserialize(saved); 
            this.player.tickerService = this.tickerService;
        } else {
            console.log("starting fresh");
            this.player = new Player(
                'Coolin',
                1,
                'Peasant',
                this.tickerService
            );
        }
        this.playerLoaded = true;
        this.setActiveGameZone(this.zones[0]);
    }

    setActiveGameZone(zone: GameZone) {
        if (zone === this.activeGameZone) {
            console.log("Ignoring no-op zone change.");
            return;
        }
        this.activeGameZone = zone;
        let intervalId = setInterval(
            // what even is this syntax?
            () => {
                this.takeAction();
            },
            GLOBALS.timestep_ms
        );
    }

    takeAction() {
        // choose which skill to train
        let skillDelta = this.zoneService.chooseSkillUp(this.activeGameZone);
        // add skill points
        this.player.trainSkill(skillDelta[0], skillDelta[1]);
        // record the event
        this.tickerService.log("Increased skill " + SkillType[skillDelta[0]] + " by " + skillDelta[1] + " points.");
    }

    saveState() {
        this.tickerService.log("Saved");
        localStorage.setItem(GLOBALS.localStorageToken,
                             this.player.serialize()
                            );
    }

    clearSave() {
        // Also reset state?
        localStorage.removeItem(GLOBALS.localStorageToken);
    }
}

const ACTION_DELAY : number = 5000;

const ZONES: GameZone[] = [
    new GameZone('Turnip Fields', 'mm turnips', 'farm', [1,0,0,0]),
    new GameZone('The Woods', 'Trees yay', 'chop', [0,0.1,0.9,0]),
];

