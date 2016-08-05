import { OnInit, SimpleChange, Component, Input, EventEmitter, Output } from '@angular/core';

import { Zone } from './zone';
import { Outcome, ZoneAction } from './zoneaction';
import { ActiveZoneService } from './activezone.service';
import { GameService } from './game.service';
import { TickerService } from './ticker.service';
import { SkillMap, SkillMapOf, truthySkills, SkillType } from './skill';
import { KickerPerk, Kicker } from './perk';

/* Responsible for maintaining its own "active" status and, when active, creating
 * and killing ZoneActions. The internal logic of those actions (their timing and 
 * effects) are left to the ZoneAction class.
 */
@Component({
    selector: 'zone',
    // TODO: Css junk - figure out how to put "ongoing" text stationary in the middle
    // of the progress div

    // Without tweak to transition-duration, it's very jerky
    styles: [`
        .progress-bar {
            transition-duration: .1s;
        }`],
    template: `
    <h3>{{zone.name}} {{active ? "(ACTIVE)" : ""}}</h3>
    <p>{{zone.description}}</p>
    <div *ngIf="currentAction">

        <div class="progress">
            <span class="ongoing">
                {{currentAction.description.present}} 
            </span>
            <div class="progress-bar" [style.width.%]="currentAction.pctProgress">
            </div>
        </div>

        <div class="previously" *ngIf="lastAction && lastAction.completed">
            <span>{{lastAction.description.past}} {{formatOutcome(lastAction.outcome)}}</span>
            <span *ngFor="let bonus of kickers">...{{bonus.description}} {{formatOutcome(bonus)}}</span>
        </div>

        <button (click)="active = false">Stop</button>
    </div>

    <div *ngIf="!active">
        <button (click)="select()">Go Here</button>
    </div>
    `
})

export class ZoneComponent implements OnInit {

    @Input() zone : Zone;
    private _active: boolean = false;
    currentAction: ZoneAction;
    lastAction: ZoneAction;
    kickers: Kicker[] = [];
    constructor(
        private activeZoneService: ActiveZoneService,
        private game: GameService,
        private tickerService: TickerService
    ) { }
    ngOnInit() {
        this.activeZoneService.activeZoneChannel.subscribe({
            next: zid => {
                this.active = (this.zone.zid == zid);
            }
        });
    }

    formatOutcome(outcome: Outcome) : string {
        let s = "(";
        truthySkills(outcome.skillDelta, 
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
    wake() {
        this.queueAction();
    }

    queueAction() {
        this.lastAction = this.currentAction;
        this.currentAction = this.zone.getAction(this.game);
        this.currentAction.start(
            () => {
                this.kickers = this.game.getKickers(this.zone, this.currentAction); 
                let outcomes: Outcome[] = (<Outcome[]>this.kickers).concat(this.currentAction.outcome);
                this.game.applyOutcomes(outcomes);
                //KickerPerk.applyKickers(this.kickers, this.game);
                //this.currentAction.broadcast(this.tickerService);
                this.queueAction(); 
                this.game.stats.actionsTakenThisLifetime++;
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
