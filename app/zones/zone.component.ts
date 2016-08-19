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
import { SkillGainsPipe } from './skill-gains.pipe';

@Component({
    selector: 'zone',
    styles: [`
        .progress-bar {
            transition-duration: .05s;
        }`],
    pipes: [SkillGainsPipe],
    template: `
    <h3>{{zone.name}} {{active ? "(ACTIVE)" : ""}}</h3>
    <p>{{zone.description}}</p>
    <div *ngIf="loaded">
        <div *ngIf="currentAction">
            <div class="progress">
                <span class="ongoing">
                    {{currentAction.description}}
                </span>
                <div (click)="actionClick()" class="progress-bar" [style.width.%]="currentAction.pctProgress">
                </div>
            </div>

            <div class="previously" *ngIf="lastOutcome">
                <div class="mainOutcome">{{lastOutcome.main.description}}
                    <div *ngIf="lastOutcome.main.outcome.pointsGained">
                        ({{lastOutcome.main.outcome.pointsGained | skillgains}})
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
        private AS: ActionService
    ) { }
    ngOnInit() {
        this.actionsub = this.AS.postActionSubject
            .filter( (post: PostActionInfo) => {
                return post.nextAction.zid == this.zone.zid;
            })
            .subscribe({
                next: (post: PostActionInfo) => {
                    if (post.nextAction.active) {
                        this.currentAction = post.nextAction;
                    }
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
            this.currentAction = undefined;
            this.lastOutcome = undefined;
        } else {
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
        this.currentAction.advanceProgress(500);
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
