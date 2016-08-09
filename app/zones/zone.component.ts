import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Zones } from './zones.service';
import { Zone, ActionOutcome, LiveZoneAction } from '../core/index';
// XXX: LiveZoneAction prolly doesn't belong there

@Component({
    selector: 'zone',
    template: `
    <h3>{{zone.name}} {{active ? "(ACTIVE)" : ""}}</h3>
    <p>{{zone.description}}</p>
    <div *ngIf="loaded">
        <div *ngIf="active && currentAction">
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
            <button (click)="active = false">Stop</button>
        </div>

        <div *ngIf="!active">
            <button (click)="select()">Go Here</button>
        </div>
    </div>
    `
})

export class ZoneComponent implements OnInit, OnDestroy {

    @Input() zone : Zone;
    private _active: boolean = false;
    currentAction: LiveZoneAction;
    lastOutcome: ActionOutcome;
    loaded: boolean = false;

    private sub: any;

    constructor(
        private zones: Zones
    ) { }
    ngOnInit() {
        this.sub = this.zones.activeSubject.subscribe({
            next: zid => {
                this.active = (this.zone.zid == zid);
                this.loaded = true;
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    select() {
        this.active = true;
        this.zones.claimActiveZone(this.zone.zid);
    }

    get active() { return this._active; }

    set active(newValue: boolean) {
        if (newValue == this._active) {
            // no-op
            return;
        }
        this._active = newValue;
        if (newValue) {
            this.activate();
        } else {
            this.deactivate();
        }
    }

    activate() {
        // zzz
    }

    deactivate() {
        // zzz
    }

}
