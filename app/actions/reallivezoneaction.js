"use strict";
var Observable_1 = require('rxjs/Observable');
var globals_1 = require('../globals');
var RealLiveZoneAction = (function () {
    function RealLiveZoneAction(description, duration, callback, zid, 
        /** The slowdown penalty (aka inexperience penalty, aka ineptitude penalty)
        applied to this action when it was started. **/
        slowdown) {
        var _this = this;
        this.description = description;
        this.duration = duration;
        this.callback = callback;
        this.zid = zid;
        this.slowdown = slowdown;
        // I guess this is probably a bad separation of concerns? Meh.
        this.tickRate = globals_1.GLOBALS.actionBarUpdateInterval;
        this.killed = false;
        /** One of "reset" or "". reset removes any transitions. We start in
        that mode so we can hop back to 0 from the 100 of the prev action. **/
        this.animationClass = "reset";
        /** SP gains from this action are multiplied by this amount. Basically
        another vector for perks to inject bonus effects.
        **/
        this.spMultiplier = 1;
        /** Match the cadence of our emissions to the speed of the transitions
        of the action bar - but we might want to check more often than that.
        TODO: Actually, this is pretty silly and unnecessary, right? Should
        just be able to dynamically set the CSS transition duration to exactly
        the duration of the action, and not bother with any timers. Dealing
        with OOB changes might become a bit more tricky though. **/
        var updateEvery = Math.ceil(globals_1.GLOBALS.actionBarTransitionMs / globals_1.GLOBALS.actionBarUpdateInterval);
        var timer = Observable_1.Observable.interval(this.tickRate);
        this.remainingTime = duration;
        this.pctProgress$ = Observable_1.Observable.create(function (observer) {
            // start at 0
            observer.next(0);
            _this.observer = observer;
        });
        this.sub = timer.subscribe(function (i) {
            if (i == 0) {
                _this.animationClass = "";
            }
            var tick = Date.now();
            var elapsed = tick - _this.lastTick;
            _this.lastTick = tick;
            // TODO: would probably be a bit nicer to use a setter for this stuff
            /** Have to do this rather than just subtracting tickRate because
            of js slowdown for inactive tabs in chrome. **/
            _this.remainingTime = Math.max(0, _this.remainingTime - elapsed);
            if (i % updateEvery == 0 || _this.remainingTime == 0) {
                _this.update();
            }
        });
        this.lastTick = Date.now();
    }
    RealLiveZoneAction.prototype.update = function () {
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
        }
        else if (this.observer) {
            var pct = this.predictivePctProgress();
            this.observer.next(pct);
        }
    };
    RealLiveZoneAction.prototype.predictivePctProgress = function () {
        // https://www.youtube.com/watch?v=l2x_XajgoDU
        /** This is complicated further because we intentionally leave an
        initial buffer of 200ms (or whatever the transition ms is), during which
        the bar should stay at 0, to avoid the 'bouncy' effect.
        So if 200/1000 ms have elapsed (or are going to elapse), we should be
        at 0%. a predicted remaining time of 400/1000ms should be 25% (200/800)
        **/
        var initialDelay = globals_1.GLOBALS.actionBarUpdateInterval;
        var predRemainingTime = this.remainingTime - globals_1.GLOBALS.actionBarTransitionMs;
        var numerator = Math.max(0, (this.duration - predRemainingTime - initialDelay));
        return 100 * numerator / (this.duration - initialDelay);
    };
    Object.defineProperty(RealLiveZoneAction.prototype, "pctProgress", {
        get: function () {
            return 100 * (this.duration - this.remainingTime) / this.duration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RealLiveZoneAction.prototype, "active", {
        get: function () {
            return this.remainingTime > 0 && (!this.killed);
        },
        enumerable: true,
        configurable: true
    });
    RealLiveZoneAction.prototype.kill = function () {
        this.killed = true;
        if (this.sub) {
            this.sub.unsubscribe();
        }
        if (this.observer) {
            this.observer.complete();
        }
    };
    RealLiveZoneAction.prototype.completeEarly = function () {
        this.remainingTime = 0;
        this.update();
    };
    // Our speed just changed by X% - we should either reduce or increase the
    // remaining time (and the duration - we want the progress bar to stay
    // at the same size, but move faster from this point on, rather than jerking
    // forward.)
    RealLiveZoneAction.prototype.adjustRemainingTime = function (speedup) {
        this.remainingTime /= speedup;
        this.duration /= speedup;
        this.update();
    };
    RealLiveZoneAction.prototype.advanceProgress = function (skipMillis) {
        this.remainingTime = Math.max(0, this.remainingTime - skipMillis);
        this.update();
    };
    return RealLiveZoneAction;
}());
exports.RealLiveZoneAction = RealLiveZoneAction;
//# sourceMappingURL=reallivezoneaction.js.map