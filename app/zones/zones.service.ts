import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ZONESARR, ZONES, SUPERZONES } from './data/zones.data';
import { Zone } from './zone';

const NOZONE_ID: number = -1;

@Injectable()
export class Zones {
    // Zone ID of active zone
    nowActive: number;
    private activeSubject: BehaviorSubject<number> = new BehaviorSubject<number>(NOZONE_ID);

    claimActiveZone(zoneid: number) {
        this.nowActive = zoneid;
        this.activeSubject.next(zoneid);
    }

    resetActiveZone() {
        this.claimActiveZone(NOZONE_ID);
    }

    get activeZone() : Zone {
        return ZONESARR[this.nowActive];
    }

    get superzones() : string[] {
        return SUPERZONES;
    }

    zonesInSuperzone(superzone: string) : Zone[] {
        return ZONES[superzone];
    }
}
