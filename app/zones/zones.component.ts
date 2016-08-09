import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { Zone } from '../core/index';
import { Zones } from './zones.service';
import { ZoneComponent } from './zone.component';

@Component({
    selector: 'zones',
    directives: [ ROUTER_DIRECTIVES, ZoneComponent ],
    styles: [
        `a {
            padding: 10px;
        }`,
    ],
    template: `
        <nav>
            <a *ngFor="let superz of superzones"
                [routerLink]="['/explore/'+superz]"
                >{{superz}}</a>
        </nav>
        <div class="zones">
        <zone *ngFor="let zone of visibleZones"
            [zone]="zone"></zone>
        </div>
    `
})
export class ZonesComponent implements OnInit {

    private activeSuperzone: string;
    private sub: any
    superzones: string[];

    constructor(
        private zones: Zones,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.activeSuperzone = params['superzone'];
        });
        this.superzones = this.zones.superzones;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    get visibleZones() : Zone[] {
        return this.zones.zonesInSuperzone(this.activeSuperzone);
    }
}
