import { OnInit, SimpleChange, Component, Input, EventEmitter, Output } from '@angular/core';

import { Zone } from './zone';
import { ZoneAction } from './zoneaction';
import { ActiveZoneService } from './activezone.service';
import { Player } from './player';
import { PlayerService } from './player.service';
import { TickerService } from './ticker.service';
import { SkillDeltas } from './zoneaction';
import { truthySkills, SkillType } from './skill';

/* Responsible for maintaining its own "active" status and, when active, creating
 * and killing ZoneActions. The internal logic of those actions (their timing and 
 * effects) are left to the ZoneAction class.
 */
@Component({
    selector: 'zone',
    // TODO: Css junk - figure out how to put "ongoing" text stationary in the middle
    // of the progress div
    template: `
    <h3>{{zone.name}} {{active ? "(ACTIVE)" : ""}}</h3>
    <p>{{zone.description}}</p>
    <div *ngIf="currentAction">

        <div class="progress">
            <span class="ongoing">{{currentAction.description.present}}</span>
            <div class="progress-bar" [style.width.%]="currentAction.pctProgress">
            </div>
        </div>

        <div class="previously" *ngIf="lastAction && lastAction.completed">
            {{lastAction.description.past}} {{formatDelta(lastAction.delta)}}
        </div>

    </div>

    <div *ngIf="!active">
        <button (click)="select()">Go Here</button>
    </div>
    `
})

export class ZoneComponent implements OnInit {

    @Input() zone : Zone;
    private _active: boolean = false;
    player: Player;
    currentAction: ZoneAction;
    lastAction: ZoneAction;
    constructor(
        private activeZoneService: ActiveZoneService,
        private playerService: PlayerService,
        private tickerService: TickerService
    ) {
        this.player = playerService.player;
    }

    formatDelta(delta: SkillDeltas) : string {
        let s = "(";
        truthySkills(delta, 
            (skill: SkillType, amt: number) => {
                s += SkillType[skill] + "+" + amt + ", ";
         });
         s += ")";
         return s;
    }


    get active() { return this._active; }
    set active(newActive: boolean) {
        if (this._active == newActive) {
            return;
        }
        this._active = newActive;
        if (newActive) {
            this.wake();
        } else {
            this.sleep();
        }
    }
    ngOnInit() {
        this.activeZoneService.activeZoneChannel.subscribe(
            zid => {
                this.active = (this.zone.zid == zid);
            });
    }
    wake() {
        this.queueAction();
    }

    queueAction() {
        this.lastAction = this.currentAction;
        this.currentAction = this.zone.getAction(this.player);
        this.currentAction.start(
            () => { 
                this.currentAction.broadcast(this.tickerService);
                this.queueAction(); 
            }
        );
    }

    sleep() {
        this.currentAction.kill();
        this.currentAction = undefined;
    }

    select() {
        this.active = true;
        this.activeZoneService.claimActiveZone(this.zone.zid);
    }

}
