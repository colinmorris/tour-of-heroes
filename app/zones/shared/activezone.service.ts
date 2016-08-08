import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ZONESARR } from './zones.data';
import { Zone } from './zone';

const NOZONE_ID: number = -1;

@Injectable()
export class ActiveZoneService {
    nowActive: number;
    private subject: BehaviorSubject<number> = new BehaviorSubject<number>(NOZONE_ID);

    activeZoneChannel = this.subject.asObservable();

    claimActiveZone(zoneid: number) {
        this.nowActive = zoneid;
        this.subject.next(zoneid);
    }

    resetActiveZone() {
        this.claimActiveZone(NOZONE_ID);
    }

    get activeZone() : Zone {
        return ZONESARR[this.nowActive];
    }
}
