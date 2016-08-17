import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SkillMap, Klass, KLASSES } from '../core/index';
import { StatsService } from '../stats/stats.service';

export interface LiveKlass extends Klass {
    unlocked: boolean;
}

@Injectable()
export class KlassService {

    starterKlass = "Peasant";
    private klassMap : {[name:string] : LiveKlass};
    private unlockCheckInterval = 5 * 1000;

    constructor(
        private stats: StatsService
    ) {
        this.klassMap = <{[name:string] : LiveKlass}>{};
        for (let klass of KLASSES) {
            let k: LiveKlass = klass as LiveKlass;
            // XXX: This is gonna cause some problems later. Should probably
            // do one immediate check.
            k.unlocked = false;
            this.klassMap[klass.name] = k;
        }
        // Set up unlock checks
        Observable.interval(this.unlockCheckInterval).subscribe( () => {
            this.checkUnlocks();
        });
    }

    get allKlasses() : LiveKlass[] {
        let klasses: LiveKlass[] = new Array<LiveKlass>();
        for (let name in this.klassMap) {
            klasses.push(this.klassMap[name]);
        }
        return klasses;
    }

    private checkUnlocks() {
        console.log("Checking for unlocks");
        for (let k of KLASSES) {
            let klass: LiveKlass = this.klassMap[k.name];
            if (klass.unlocked) {
                continue;
            }
            let didUnlock = klass.criteria(this.stats);
            if (didUnlock) {
                console.log(`Wow!! Unlocked ${klass.name}`);
            }
            this.klassMap[klass.name].unlocked = didUnlock;
        }
    }

    aptitudesForKlass(klass: string) : SkillMap {
        return this.klassMap[klass].aptitudes;
    }

}
