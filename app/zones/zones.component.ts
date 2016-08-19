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
    <div class="superzones panel-group">
        <div *ngFor="let pane of panes" class="panel panel-default">

            <div (click)="pane.expanded = !pane.expanded"
                class="panel-heading"
            >
                <h4 class="panel-title">
                <a role="button">
                {{pane.name}}
                </a>
                </h4>
            </div>

            <div *ngIf="pane.expanded" class="panel-body">
                <ul class="list-group">
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
