import { Inject, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Zones } from './zones.service';
import { Zone, ActionOutcome, LiveZoneAction } from '../core/index';
import { actionToken } from '../globals';
import { ActionService, PostActionInfo } from '../actions/action.service';

@Component({
    selector: 'zone',
    styles: [`
        .progress-bar {
            transition-duration: .05s;
        }`],
    template: `
    <h3>{{zone.name}} {{active ? "(ACTIVE)" : ""}}</h3>
    <p>{{zone.description}}</p>
    <div *ngIf="loaded">
        <div *ngIf="currentAction">
            <div class="progress">
                <span class="ongoing">
                    {{currentAction.description}}
                </span>
                <div class="progress-bar" [style.width.%]="currentAction.pctProgress">
                </div>
            </div>

            <div class="previously" *ngIf="lastOutcome">
                <div class="mainOutcome">{{lastOutcome.main.description}}</div>
                <div *ngFor="let bonus of lastOutcome.secondary" class="secondaryOutcome">
                    {{bonus.description}}
                </div>
            </div>
            <button (click)="deactivate()">Stop</button>
        </div>

        <div *ngIf="!currentAction">
            <button (click)="select()">Go Here</button>
        </div>
    </div>
    `
})

export class ZoneComponent implements OnInit, OnDestroy {

    @Input() zone : Zone;
    currentAction: LiveZoneAction;
    lastOutcome: ActionOutcome;
    loaded: boolean = false;

    private actionsub: any;

    constructor(
        @Inject(actionToken) private AS: ActionService
    ) { }
    ngOnInit() {
        this.currentAction = this.AS.ongoingActionForZone(this.zone);
        if (this.currentAction) {
            this.setupActionListener();
        }
        this.loaded = true;
    }

    ngOnDestroy() {
        if (this.actionsub) {
            this.actionsub.unsubscribe();
        }
    }

    setupActionListener() {
        this.actionsub = (this.AS.observableForZone(this.zone)
            .subscribe({
                next: (post: PostActionInfo) => {
                    this.currentAction = post.nextAction;
                    this.lastOutcome = post.outcome;
                },
                complete: () => {
                    this.currentAction = undefined;
                    this.lastOutcome = undefined;
                }
            }));
    }

    select() {
        this.currentAction = this.AS.startActionLoop(this.zone);
        this.setupActionListener();
    }

    private deactivate() {
        this.AS.stopActionLoop(this.zone);
        this.actionsub.unsubscribe();
        this.currentAction = undefined;
        this.lastOutcome = undefined;
    }

}
