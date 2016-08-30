import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Zones } from '../zones/zones.service';
import { StatsService } from './stats.service';
import { Stat } from '../core/index';



@Component({
    selector: 'stats',
    template: `
        <h1>Stats</h1>
        <table class="table">
            <thead>
            <tr><th>Stat</th>   <th>This Life</th>  <th>All Time</th></tr>
            </thead>
            <tbody>
            <tr *ngFor="let istat of interestingStats">
                <td>{{istat.desc}}</td>
                <td>{{istat.current}}</td>
                <td>{{istat.total}}</td>
            </tr>
            </tbody>
        </table>
    `
})
export class StatsComponent {
    interestingStatTypes = [
        {stat: Stat.ActionsTaken, desc: "Actions Taken"},
        {stat: Stat.Clicks, desc: "Clicks"},
        {stat: Stat.Reincarnations, desc: "Reincarnations"},
        {stat: Stat.SpellsCast, desc:"Spells Cast"},
        {stat: Stat.CriticalActions, desc: "Critical Actions"}
    ];
    constructor(
        private stats: StatsService,
        private zones: Zones
    ) {

    }
    get interestingStats() {
        let res = [];
        for (let s of this.interestingStatTypes) {
            let current = s.stat == Stat.Reincarnations ? "-" : this.stats.current(s.stat);
            res.push({desc: s.desc,
                current: current,
                total: this.stats.lifetimeSum(s.stat)
            });
        }
        return res;
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
