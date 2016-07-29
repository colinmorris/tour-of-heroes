import { OnInit, SimpleChange, Component, Input, EventEmitter, Output } from '@angular/core';

import { Zone } from './zone';
import { ActiveZoneService } from './activezone.service';
import { ProgressBarComponent } from './progressbar.component';

@Component({
    selector: 'zone',
    directives: [ProgressBarComponent],
    template: `
    <h3>{{zone.name}} {{active ? "(ACTIVE)" : ""}}</h3>
    <p>{{zone.description}}</p>
    <div *ngIf="active">
        <progress-bar [numerator]="1" [denominator]="5"></progress-bar>
    </div>
    <div *ngIf="!active">
        <button (click)="select()">Go Here</button>
    </div>
    `
})

export class ZoneComponent implements OnInit {

    @Input() zone : Zone;
    @Output() onSelect = new EventEmitter<Zone>();
    active: boolean = false;
    constructor(private activeZoneService: ActiveZoneService) {
    }

    select() {
        this.active = true;
        this.activeZoneService.claimActiveZone(this.zone.zid);
        // TODO: not needed?
        this.onSelect.emit(this.zone);
    }

    ngOnInit() {
        this.activeZoneService.activeZoneChannel.subscribe(
            zid => {
                this.active = (this.zone.zid == zid);
            });
        }
}
