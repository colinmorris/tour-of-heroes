import { Inject,
    Component,
    Input,
    SimpleChange,
    OnChanges,
    OnInit,
    OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Zones } from './zones.service';
import { Zone, ActionOutcome, LiveZoneAction } from '../core/index';
import { ActionService, PostActionInfo } from '../actions/action.service';
import { PlayerService } from '../player/player.service';
import { StatsService } from '../stats/stats.service';
import { SkillGainsPipe } from './skill-gains.pipe';
import { GLOBALS } from '../globals';

@Component({
    selector: 'zone',
    styles: [`
        .progress-bar {
            transition-duration: ${GLOBALS.actionBarTransitionMs}ms;
            transition-timing-function: linear;
        }
        .progress-bar.reset {
            transition: none;
        }
        .progress {
            height: 40px;
            width: 85%;
        }
        .ongoing-text {
            font-weight: bold;
        }
        `],
    pipes: [SkillGainsPipe],
    template: `
    <h3>{{zone.name}} {{active ? "(ACTIVE)" : ""}}</h3>
    <p>{{zone.description}}</p>
    <div *ngIf="loaded">
        <div *ngIf="currentAction">
            <span class="ongoing-text">
            {{currentAction.description}}...
            </span>
            <div class="progress center-block" (click)="actionClick()">
                <div
                    class="progress-bar {{currentAction.animationClass}}"
                    [style.width.%]="currentAction.pctProgress$ | async"
                    >
                </div>
            </div>

            <div class="previously" *ngIf="lastOutcome">
                <div class="mainOutcome">{{lastOutcome.main.description}}
                    <div *ngIf="lastOutcome.main.pointsGained">
                        ({{lastOutcome.main.pointsGained | skillgains}})
                    </div>
                </div>
                <div *ngFor="let bonus of lastOutcome.secondary" class="secondaryOutcome">
                    {{bonus.description}}
                </div>
            </div>
            <button (click)="stopAction()" class="btn btn-danger">Stop</button>
        </div>

        <div *ngIf="!currentAction">
            <button (click)="select()" class="btn btn-primary">Explore</button>
        </div>
    </div>
    `
})

export class ZoneComponent implements OnInit, OnDestroy, OnChanges {

    @Input() zone : Zone;
    currentAction: LiveZoneAction;
    lastOutcome: ActionOutcome;
    loaded: boolean = false;

    private actionsub: any;

    constructor(
        private AS: ActionService,
        private PS: PlayerService,
        private Stats: StatsService
    ) { }
    ngOnInit() {
        console.assert(this.actionsub === undefined);
        this.actionsub = this.AS.postActionSubject
            .filter( (post: PostActionInfo) => {
                return post.nextAction.zid == this.zone.zid;
            })
            .subscribe({
                next: (post: PostActionInfo) => {
                    if (post.nextAction.active) {
                        this.currentAction = post.nextAction;
                    } else {
                        console.log("Action was DoA");
                    }
                    console.assert(post.nextAction.zid == this.zone.zid);
                    this.lastOutcome = post.outcome;
                }
            });

        this.loaded = true;
    }

    ngOnDestroy() {
        if (this.actionsub) {
            this.actionsub.unsubscribe();
        }
    }

    // this kind of sucks. Would like it if we could just create a new component
    // every time the zone changes
    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        console.assert("zone" in changes);
        if (this.currentAction) {
            console.log("Zone change. Nulling out current action and last outcome.");
            this.currentAction = undefined;
            this.lastOutcome = undefined;
        } else {
            // possible this is causing a race condition?
            console.log("Zone change. Grabbing last action");
            this.AS.postActionSubject.take(1).subscribe( {
                next: (post: PostActionInfo) => {
                    if (post.nextAction.active &&
                          post.nextAction.zid == changes["zone"].currentValue.zid
                       ) {
                        this.currentAction = post.nextAction;
                        this.lastOutcome = post.outcome;
                    }
                }
            });
        }
    }

    actionClick() {
        // TODO: Throttle these to thwart evil auto-clickers
        let skip = 500;
        let buffedSkip = skip * this.PS.player.meta.clickMultiplier;
        if (buffedSkip != skip) {
            console.log(`Click power buffed from ${skip} to ${buffedSkip}`);
        }
        this.currentAction.advanceProgress(buffedSkip);
        this.Stats.clicked();
    }

    select() {
        this.currentAction = this.AS.startActionLoop(this.zone);
    }

    private stopAction() {
        this.AS.stopActionLoop(this.zone);
        this.currentAction = undefined;
        this.lastOutcome = undefined;
    }

}
