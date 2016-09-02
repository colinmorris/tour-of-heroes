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
    // Timestamp of the last timer check
    private lastTick;
    // Observed by the zone component, used to set the progress bar width
    pctProgress$ : Observable<number>;
    private observer: Observer<number>;
    /** One of "reset" or "". reset removes any transitions. We start in
    that mode so we can hop back to 0 from the 100 of the prev action. **/
    animationClass: string = "reset";
    /** SP gains from this action are multiplied by this amount. Basically
    another vector for perks to inject bonus effects.
    **/
    public spMultiplier = 1;
    constructor(
        public description: string,
        public duration: number,
        private callback: () => void,
        public zid: number,
        /** The slowdown penalty (aka inexperience penalty, aka ineptitude penalty)
        applied to this action when it was started. **/
        public slowdown: number
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
            // start at 0
            observer.next(0);
            this.observer = observer;
        });
        this.sub = timer.subscribe(
            (i) => {
                if (i == 0) {
                    this.animationClass = "";
                }
                let tick = Date.now();
                let elapsed = tick - this.lastTick;
                this.lastTick = tick;
                // TODO: would probably be a bit nicer to use a setter for this stuff
                /** Have to do this rather than just subtracting tickRate because
                of js slowdown for inactive tabs in chrome. **/
                this.remainingTime = Math.max(0, this.remainingTime - elapsed);
                if (i % updateEvery == 0 || this.remainingTime == 0) {
                    this.update();
                }
            }
        );
        this.lastTick = Date.now();
    }

    update() {
        if (this.animationClass == "reset") {
            return;
        }
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
        /** This is complicated further because we intentionally leave an
        initial buffer of 200ms (or whatever the transition ms is), during which
        the bar should stay at 0, to avoid the 'bouncy' effect.
        So if 200/1000 ms have elapsed (or are going to elapse), we should be
        at 0%. a predicted remaining time of 400/1000ms should be 25% (200/800)
        **/
        let initialDelay = GLOBALS.actionBarUpdateInterval;
        let predRemainingTime = this.remainingTime - GLOBALS.actionBarTransitionMs;
        let numerator = Math.max(0,
            (this.duration - predRemainingTime - initialDelay));
        return 100 * numerator / (this.duration - initialDelay);
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
