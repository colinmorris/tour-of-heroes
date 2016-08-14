import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SkillMap, Klass, KLASSES } from '../core/index';
import { StatsService } from '../stats/stats.service';

@Injectable()
export class KlassService {

    starterKlass = "Peasant";
    private klassMap : {[name:string] : Klass};
    private unlocked : {[name:string] : boolean} = <{[name:string] : boolean}>{};
    private unlockCheckInterval = 5 * 1000;

    constructor(
        private stats: StatsService
    ) {
        this.klassMap = <{[name:string] : Klass}>{};
        for (let klass of KLASSES) {
            this.klassMap[klass.name] = klass;
            // XXX: This is gonna cause some problems later
            this.unlocked[klass.name] = false;
        }
        // Set up unlock checks
        Observable.interval(this.unlockCheckInterval).subscribe( () => {
            this.checkUnlocks();
        });
    }

    private checkUnlocks() {
        console.log("Checking for unlocks");
        for (let klass of KLASSES) {
            if (this.unlocked[klass.name]) {
                continue;
            }
            let didUnlock = klass.criteria(this.stats);
            if (didUnlock) {
                console.log(`Wow!! Unlocked ${klass.name}`);
            }
            this.unlocked[klass.name] = didUnlock;
        }
    }

    aptitudesForKlass(klass: string) : SkillMap {
        return this.klassMap[klass].aptitudes;
    }

}
