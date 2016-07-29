import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ActiveZoneService {
    nowActive: number;
    private subject = new Subject<number>();

    activeZoneChannel = this.subject.asObservable();

    claimActiveZone(zoneid: number) {
        this.nowActive = zoneid;
        this.subject.next(zoneid);
    }
}
