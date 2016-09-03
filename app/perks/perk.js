"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require('rxjs/Observable');
var di_tokens_1 = require('../shared/di-tokens');
var index_1 = require('../core/index');
// TODO: This file needs to be split up.
// also moved to core?
var AbstractBonus = (function (_super) {
    __extends(AbstractBonus, _super);
    function AbstractBonus() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(AbstractBonus.prototype, "name", {
        get: function () {
            // haaaack. http://stackoverflow.com/a/29244254/262271
            return this.constructor.sname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractBonus.prototype, "description", {
        get: function () {
            return this.constructor.sdescription;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractBonus;
}(index_1.InjectedArgs));
exports.AbstractBonus = AbstractBonus;
var AbstractSpell = (function (_super) {
    __extends(AbstractSpell, _super);
    function AbstractSpell() {
        _super.apply(this, arguments);
        this.cooldownCheckInterval = 1000;
    }
    Object.defineProperty(AbstractSpell.prototype, "cooldownMs", {
        get: function () { return 1000 * this.cooldown; },
        enumerable: true,
        configurable: true
    });
    /** Return success/failure **/
    AbstractSpell.prototype.cast = function () {
        if (this.remainingCooldown > 0) {
            console.log("Can't cast " + this.name + ". Still on cooldown");
            return false;
        }
        var args = this.injectionArgs();
        var success = this.onCast.apply(this, args);
        if (success) {
            this.goOnCooldown();
        }
        return success;
    };
    AbstractSpell.prototype.goOnCooldown = function () {
        var _this = this;
        this.remainingCooldown = this.cooldownMs;
        this.lastTick = Date.now();
        var cooldownTimer = Observable_1.Observable.interval(this.cooldownCheckInterval);
        this.sub = cooldownTimer.subscribe(function (i) {
            var tick = Date.now();
            var elapsed = tick - _this.lastTick;
            _this.lastTick = tick;
            _this.remainingCooldown = Math.max(0, _this.remainingCooldown - elapsed);
            if (_this.remainingCooldown == 0) {
                _this.sub.unsubscribe();
            }
        });
    };
    return AbstractSpell;
}(AbstractBonus));
exports.AbstractSpell = AbstractSpell;
var AbstractBuffingSpell = (function (_super) {
    __extends(AbstractBuffingSpell, _super);
    function AbstractBuffingSpell() {
        _super.apply(this, arguments);
        //buffDuration: number = undefined;
        this.diTokens = [di_tokens_1.di_tokens.perkservice];
    }
    AbstractBuffingSpell.prototype.onCast = function (PS) {
        // You are treading on extremely fucking thin ice here. Have to be super
        // careful about not introducing circular dependencies/infinite loops.
        // XXX: refactor me
        PS.addBuff(this.buffName);
        return true;
    };
    return AbstractBuffingSpell;
}(AbstractSpell));
exports.AbstractBuffingSpell = AbstractBuffingSpell;
var AbstractBaseBuff = (function (_super) {
    __extends(AbstractBaseBuff, _super);
    function AbstractBaseBuff() {
        _super.apply(this, arguments);
    }
    AbstractBaseBuff.prototype.onDestroy = function () {
        var args = this.injectionArgs();
        this.cleanUp.apply(this, args);
    };
    return AbstractBaseBuff;
}(AbstractBonus));
exports.AbstractBaseBuff = AbstractBaseBuff;
// AKA temporary buff
var AbstractBuff = (function (_super) {
    __extends(AbstractBuff, _super);
    function AbstractBuff() {
        _super.apply(this, arguments);
    }
    return AbstractBuff;
}(AbstractBaseBuff));
exports.AbstractBuff = AbstractBuff;
var AbstractTimedBuff = (function (_super) {
    __extends(AbstractTimedBuff, _super);
    function AbstractTimedBuff() {
        _super.apply(this, arguments);
        this.remainingTime = 0;
        this.timeCheckInterval = 1000;
    }
    AbstractTimedBuff.prototype.apply = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var args = _this.injectionArgs();
            _this.remainingTime = _this.duration * 1000;
            _this.lastTick = Date.now();
            _this.onCast.apply(_this, args);
            // TODO: this pattern is pretty common. Would be nice to refactor it.
            // TODO: Should probably use the take operator too
            _this.sub = Observable_1.Observable.interval(_this.timeCheckInterval).subscribe(function () {
                var tick = Date.now();
                var elapsed = tick - _this.lastTick;
                _this.lastTick = tick;
                _this.remainingTime = Math.max(0, _this.remainingTime - elapsed);
                if (_this.remainingTime == 0) {
                    _this.sub.unsubscribe();
                    _this.cleanUp.apply(_this, args);
                    resolve();
                }
            });
        });
        return promise;
    };
    AbstractTimedBuff.prototype.onDestroy = function () {
        if (this.sub) {
            this.sub.unsubscribe();
        }
        var args = this.injectionArgs();
        this.cleanUp.apply(this, args);
    };
    AbstractTimedBuff.prototype.refresh = function (buff) {
        /** This would seem to pose a problem for many-flavoured buffs like
        Fruity, but keep in mind that equivalence will be determined by perk
        service according to buff *names*. So as long as fundamentally different
        instances of a buff type get different names, they shouldn't overwrite
        each other.
        **/
        console.log("Refreshing duration of " + this.name);
        this.remainingTime = this.duration * 1000;
    };
    return AbstractTimedBuff;
}(AbstractBuff));
exports.AbstractTimedBuff = AbstractTimedBuff;
var AbstractPassive = (function (_super) {
    __extends(AbstractPassive, _super);
    function AbstractPassive() {
        _super.apply(this, arguments);
    }
    // (Sort of a hack. I'm toying with the idea of passives being able to return
    // success/failure. Makes sense for ancestry perk, possibly for others.)
    AbstractPassive.prototype.apply = function () {
        var args = this.injectionArgs();
        return this.onCast.apply(this, args);
    };
    return AbstractPassive;
}(AbstractBaseBuff));
exports.AbstractPassive = AbstractPassive;
//# sourceMappingURL=perk.js.map