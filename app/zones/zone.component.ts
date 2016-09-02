import { Inject,
    Component,
    Input,
    SimpleChange,
    OnChanges,
    OnInit,
    OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Zones } from './zones.service';
import { Zone, ActionOutcome, LiveZoneAction,
    levelUpZone, leveledZone,
    XpFormulas
 } from '../core/index';
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
            font-size: large;
        }
        .action-main {
            min-height: 100px;
        }
        .previously {
            margin-left: 25px;
        }
        .zone-header {
            font-weight: bold;
        }
        `],
    pipes: [SkillGainsPipe],
    template: `
    <div class="row">
        <div class="col-xs-6">
            <h3>{{zone.name}}</h3>
        </div>
        <div class="col-xs-6">
            <spell-bar></spell-bar>
        </div>
    </div>

    <div class="action-main"
    *ngIf="loaded">
        <div *ngIf="currentAction">
            <p class="ongoing-text text-center">
                {{currentAction.description}}...
            </p>
            <div class="progress center-block" (click)="actionClick()">
                <div
                    class="progress-bar {{currentAction.animationClass}}"
                    [style.width.%]="currentAction.pctProgress$ | async"
                    >
                </div>
            </div>

            <div class="previously" *ngIf="lastOutcome">
                <p class="mainOutcome">{{lastOutcome.main.description}}
                    <span *ngIf="lastOutcome.main.pointsGained">
                        ({{lastOutcome.main.pointsGained | skillgains}})
                    </span>
                </p>
                <p *ngFor="let bonus of lastOutcome.secondary" class="secondaryOutcome">
                    ... {{bonus.description}}
                    <span *ngIf="bonus.pointsGained">
                        ({{bonus.pointsGained | skillgains}})
                    </span>
                </p>
            </div>
        </div>

        <div *ngIf="!currentAction">
            {{zone.description}}

            <div *ngIf="PS.canLevelZones() || cheatMode"
                class="row">
                <div class="col-xs-9">
                <div class="panel panel-info">
                <div class="panel-heading">
                <h3 class="panel-title">
                <a
                    (click)="levelUpExpanded = !levelUpExpanded"
                >
                Level up...
                <span class="glyphicon glyphicon-chevron-down"></span>
                </a>
                </h3>
                </div>

                <div *ngIf="levelUpExpanded" class="panel-body">
                    <p>Leveling up will significantly increase the difficulty of this
                    zone.</p>
                    <p>Costs <b>1 Zone Improvement Token</b> (have: {{Stats.ziTokens}})
                    and requires level {{plevelToLevelZone()}}.</p>

                    <!-- TODO: lots of copy-pasting going on here -->
                    <ul class="list-group">

                    <li class="list-group-item zone-header">
                    <div class="row">
                        <div class="col-xs-2">Zone</div>
                        <div class="col-xs-1">Level</div>
                        <div class="col-xs-4">Skills</div>
                        <div class="col-xs-2"
                        title="If your skill levels are too low, actions will take longer"
                        >Slowdown</div>
                    </div>
                    </li>

                    <li class="list-group-item">
                    <zone-summary [zone]="zone" [live]="false">
                    </zone-summary>
                    </li>

                    <li class="list-group-item">
                    <div class="center-block" [style.width]="50">
                        <h3><span class="glyphicon glyphicon-arrow-down"></span></h3>
                    </div>
                    </li>

                    <li class="list-group-item">
                    <zone-summary [zone]="leveledZone()" [live]="false">
                    </zone-summary>
                    </li>

                    </ul>

                    <button class="btn"
                    [class.disabled]="!canLevelZone() && !cheatMode"
                    (click)="levelZone()">Level up</button>
                    <button class="btn"
                    (click)="delevelZone()">Delevel</button>

                </div>
            </div></div></div>
        </div>
    </div>

    <div class="action-options">
        <button (click)="select()"
            class="btn btn-primary"
            *ngIf="!currentAction">Explore</button>
        <button (click)="stopAction()"
            class="btn btn-danger"
            *ngIf="currentAction">Stop</button>
    </div>
    `
})

export class ZoneComponent implements OnInit, OnDestroy, OnChanges {
    levelUpExpanded = false;
    @Input() zone : Zone;
    currentAction: LiveZoneAction;
    lastOutcome: ActionOutcome;
    loaded: boolean = false;
    cheatMode = GLOBALS.cheatMode;

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
                        /** TODO: This seems to be correlated with spurious
                        lastOutcome strings **/
                        console.log("Action was DoA");
                    }
                    console.assert(post.nextAction.zid == this.zone.zid);
                    this.lastOutcome = post.outcome;
                }
            });

        this.loaded = true;
    }

    canLevelZone() {
        return this.Stats.ziTokens > 0 && this.PS.player.level >= this.plevelToLevelZone();
    }

    plevelToLevelZone() {
        /** TODO: The fact that zone.difficulty isn't updated when level
        is increased is probably a bug. **/
        return 1;
        //return this.zone.difficulty +
        //    ((this.zone.level + 1) * GLOBALS.difficultyBonusPerZoneLevel);
    }

    ngOnDestroy() {
        if (this.actionsub) {
            this.actionsub.unsubscribe();
        }
    }

    masteryIncreasePerZoneLevel() {
        return Math.ceil(GLOBALS.difficultyBonusPerZoneLevel * XpFormulas.benchmarkSkillLevelForPlevel(1));
    }

    // this kind of sucks. Would like it if we could just create a new component
    // every time the zone changes
    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        console.assert("zone" in changes);
        this.levelUpExpanded = false;
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
        if (Math.random() < this.PS.player.meta.clickCritRate) {
            buffedSkip *= this.PS.player.meta.clickCritMultiplier;
            console.log("Critical click!");
        }
        if (buffedSkip != skip) {
            console.log(`Click power buffed from ${skip} to ${buffedSkip}`);
        }
        this.currentAction.advanceProgress(buffedSkip);
        this.Stats.clicked();
    }

    levelZone() {
        let level = this.zone.level + 1;
        levelUpZone(this.zone, level);
        this.Stats.leveledZone(this.zone.name, level);
        this.Stats.ziTokens -= 1;
        /** TODO: This is a huge hack. Just a quick and dirty way to
        get the corresponding zone-summary component to perform change
        detection. Come up with a less fragile approach when/if this
        zone leveling thing crystalizes. **/
        this.PS.player.skillChange$.next(0);
    }

    // Return a leveled version of current zone (as a preview - don't actually level it)
    leveledZone() {
        return leveledZone(this.zone, this.zone.level+1);
    }

    delevelZone() {
        let level = this.zone.level -1;
        levelUpZone(this.zone, level);
        this.Stats.leveledZone(this.zone.name, level);
        this.Stats.ziTokens += 1;
        /** TODO: This is a huge hack. Just a quick and dirty way to
        get the corresponding zone-summary component to perform change
        detection. Come up with a less fragile approach when/if this
        zone leveling thing crystalizes. **/
        this.PS.player.skillChange$.next(0);
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
