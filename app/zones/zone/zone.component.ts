import { OnInit, SimpleChange, Component, Input, EventEmitter, Output } from '@angular/core';

import { Zone, ZoneAction, ActiveZoneService } from '../shared';
import { PlayerService } from '../../player';
import { TickerService } from '../../ticker';
import { SkillMap, SkillMapOf, truthySkills, SkillType } from '../../skills';
import { ActiveZoneComponent } from '../activezone';

/* Responsible for maintaining its own "active" status and, when active, creating
 * and killing ZoneActions. The internal logic of those actions (their timing and
 * effects) are left to the ZoneAction class.
 */
@Component({
    selector: 'zone',
    directives: [ActiveZoneComponent],
    template: `
    <h3>{{zone.name}} {{active ? "(ACTIVE)" : ""}}</h3>
    <p>{{zone.description}}</p>
    <div *ngIf="active">
        <active-zone [zone]="zone"></active-zone>
        <button (click)="active = false">Stop</button>
    </div>

    <div *ngIf="!active">
        <button (click)="select()">Go Here</button>
    </div>
    `
})

export class ZoneComponent implements OnInit {

    @Input() zone : Zone;
    public active: boolean = false;

    constructor(
        private activeZoneService: ActiveZoneService,
        private tickerService: TickerService
    ) { }
    ngOnInit() {
        this.activeZoneService.activeZoneChannel.subscribe({
            next: zid => {
                this.active = (this.zone.zid == zid);
            }
        });
    }

    select() {
        this.active = true;
        this.activeZoneService.claimActiveZone(this.zone.zid);
    }

}
