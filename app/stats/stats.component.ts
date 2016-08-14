import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Zones } from '../zones/zones.service';
import { StatsService } from './stats.service';
import { Stat } from './stats.service.interface';

@Component({
    selector: 'stats',
    template: `
        <h1>Stats!</h1>
        <h3>Max level attained per class:</h3>
        <ul>
            <li *ngFor="let klass of maxLevelPerKlass()">
                {{klass}} : {{stats.maxLevelPerKlass()[klass]}}
            </li>
        </ul>
        <h3>Actions taken</h3>
        Total: {{totalActions()}}
        This lifetime: {{currActions()}}
        Per Zone:
        <ul>
            <li *ngFor="let zone of zones.allZones">
                {{zone.name}} : {{stats.actionsTaken(zone.name)}}
            </li>
        </ul>

    `
})
export class StatsComponent {

    constructor(
        private stats: StatsService,
        private zones: Zones
    ) {

    }
    totalActions() {
        // TODO: add these helpers to StatsService
        return this.stats.lifetimeSum(Stat.ActionsTaken);
    }
    currActions() {
        return this.stats.current(Stat.ActionsTaken);
    }
    maxLevelPerKlass() {
        // TODO: this is dumb, should be a call to klassService
        let keys = [];
        for (let key in this.stats.maxLevelPerKlass()) {
            keys.push(key);
        }
        return keys;
    }
}
