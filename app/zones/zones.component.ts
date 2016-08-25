import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Zone } from '../core/index';
import { Zones } from './zones.service';
import { ZoneSummaryComponent } from './zone-summary.component';

interface SuperzonePane {
    name: string;
    expanded: boolean; // not currently used
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
    <div>

    <ul class="nav nav-tabs">
        <li *ngFor="let pane of panes"
        [class.active]="activePane==pane"
         >
            <a (click)="activePane=pane">{{pane.name}}</a>
        </li>
    </ul>

    <div class="tab-content">
        <div *ngFor="let pane of panes"
         class="tab-pane"
         [class.active]="activePane==pane"
         >
            <ul *ngIf="activePane==pane" class="list-group">
                <li *ngFor="let zone of pane.zones" class="list-group-item">
                    <zone-summary [zone]="zone">
                    </zone-summary>
                </li>
            </ul>
        </div>
    </div>

    </div>
    `
})
export class ZonesComponent implements OnInit {
    activePane: SuperzonePane;
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
        this.activePane = this.panes[0];
    }

}
