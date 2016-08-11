import { Observable } from 'rxjs/Observable';

import { GLOBALS } from '../globals';
import { LiveZoneAction } from '../core/index';

export class RealLiveZoneAction implements LiveZoneAction {
    remainingTime: number;
    private sub: any;
    // I guess this is probably a bad separation of concerns? Meh.
    private tickRate = GLOBALS.actionBarUpdateInterval;
    constructor(
        public description: string,
        public duration: number,
        private callback: () => void
    ) {

        let timer = Observable.interval(this.tickRate);
        this.remainingTime = duration;
        this.sub = timer.subscribe(
            (i) => {
                this.remainingTime = Math.max(0, this.remainingTime - this.tickRate);
                if (this.remainingTime == 0) {
                    // is this necessary? I'm confused
                    this.sub.unsubscribe();
                    callback();
                }
            }
        );
    }
    get pctProgress() : number {
        return 100 * (this.duration - this.remainingTime) / this.duration;
    }

    kill() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    completeEarly() {
        // this'll be noticed at the next tick (which should make it appear basically instant)
        this.remainingTime = 0;
    }

    // Our speed just changed by X% - we should either reduce or increase the
    // remaining time
    adjustRemainingTime(speedup: number) {
        this.remainingTime /= speedup;
    }
}
