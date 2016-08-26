import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { GLOBALS } from '../globals';
import { LiveZoneAction } from '../core/index';

export class RealLiveZoneAction implements LiveZoneAction {
    remainingTime: number;
    private sub: any;
    // I guess this is probably a bad separation of concerns? Meh.
    private tickRate = GLOBALS.actionBarUpdateInterval;
    private killed = false;
    // Observed by the zone component, used to set the progress bar width
    pctProgress$ : Observable<number>;
    private observer: Observer<number>;
    /** One of "reset" or "". reset removes any transitions. We start in
    that mode so we can hop back to 0 from the 100 of the prev action. **/
    animationClass: string = "reset";
    constructor(
        public description: string,
        public duration: number,
        private callback: () => void,
        public zid: number
    ) {

        /** Match the cadence of our emissions to the speed of the transitions
        of the action bar - but we might want to check more often than that.
        TODO: Actually, this is pretty silly and unnecessary, right? Should
        just be able to dynamically set the CSS transition duration to exactly
        the duration of the action, and not bother with any timers. Dealing
        with OOB changes might become a bit more tricky though. **/
        let updateEvery = Math.ceil(
            GLOBALS.actionBarTransitionMs / GLOBALS.actionBarUpdateInterval);
        let timer = Observable.interval(this.tickRate);
        this.remainingTime = duration;
        this.pctProgress$ = Observable.create ( (observer) => {
            this.observer = observer;
        });
        this.sub = timer.subscribe(
            (i) => {
                // TODO: would probably be a bit nicer to use a setter for this stuff
                this.remainingTime = Math.max(0, this.remainingTime - this.tickRate);
                if (i % updateEvery == 0 || this.remainingTime == 0) {
                    this.update();
                }
            }
        );

        // One timeout so we can get an observer, another for the DOM to get
        // updated.
        setTimeout(()=> {
            if (this.observer) {
                this.observer.next(0);
            }
            setTimeout(()=> {
                this.animationClass = "";
                this.update()
            }, 0);
        }, 0);
    }

    update() {
        if (this.remainingTime == 0) {
            // TODO: is this necessary? probably not, but I'm confused
            this.sub.unsubscribe();
            this.callback();
            if (this.observer) {
                this.observer.complete();
            }
        } else if (this.observer) {
            let pct = this.predictivePctProgress();
            this.observer.next(pct);
        }
    }

    predictivePctProgress() : number {
        // https://www.youtube.com/watch?v=l2x_XajgoDU
        let predRemainingTime = this.remainingTime - GLOBALS.actionBarTransitionMs;
        return 100 * (this.duration - predRemainingTime) / this.duration;
    }

    get pctProgress() : number {
        return 100 * (this.duration - this.remainingTime) / this.duration;
    }

    get active() : boolean {
        return this.remainingTime > 0 && (!this.killed);
    }

    kill() {
        this.killed = true;
        if (this.sub) {
            this.sub.unsubscribe();
        }
        if (this.observer) {
            this.observer.complete();
        }
    }

    completeEarly() {
        // this'll be noticed at the next tick (which should make it appear basically instant)
        this.remainingTime = 0;
        this.update();
    }

    // Our speed just changed by X% - we should either reduce or increase the
    // remaining time (and the duration - we want the progress bar to stay
    // at the same size, but move faster from this point on, rather than jerking
    // forward.)
    adjustRemainingTime(speedup: number) {
        this.remainingTime /= speedup;
        this.duration /= speedup;
        this.update();
    }

    advanceProgress(skipMillis: number) {
        this.remainingTime = Math.max(0, this.remainingTime - skipMillis);
        this.update();
    }
}
