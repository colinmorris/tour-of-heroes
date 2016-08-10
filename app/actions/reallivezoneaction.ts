// TODO: not sure about these omnibus imports
import { Observable } from 'rxjs/Rx';

import { GLOBALS } from '../globals';
import { LiveZoneAction } from '../core/index';

export class RealLiveZoneAction implements LiveZoneAction {
    remainingTime: number;
    private sub: any;
    // TODO: I guess this is probably a bad separation of concerns? Meh.
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
                this.remainingTime -= this.tickRate;
                if (this.remainingTime <= 0) {
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
}
