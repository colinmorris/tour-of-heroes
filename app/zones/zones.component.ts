import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Zone } from '../core/index';
import { Zones } from './zones.service';
import { ZoneSummaryComponent } from './zone-summary.component';

interface SuperzonePane {
    name: string;
    expanded: boolean;
    zones: Zone[];
}

@Component({
    selector: 'zones',
    directives: [ ZoneSummaryComponent ],
    styles: [
        `a {
            padding: 10px;
        }`,
    ],
    template: `
    <div class="superzones">
        <div *ngFor="let pane of panes">
            <a (click)="pane.expanded = !pane.expanded">
                {{pane.name}}
            </a>
            <div *ngIf="pane.expanded">
                <zone-summary [zone]="zone"
                *ngFor="let zone of pane.zones"
                ></zone-summary>
            </div>
        </div>
    </div>
    `
})
export class ZonesComponent implements OnInit {
    panes: SuperzonePane[] = new Array<SuperzonePane>();

    constructor(
        private zones: Zones
    ) {}

    ngOnInit() {
        console.assert(this.panes.length == 0);
        for (let superz of this.zones.superzones) {
            this.panes.push({
                name: superz, expanded: false,
                zones: this.zones.zonesInSuperzone(superz)
            });
        }
    }

}
