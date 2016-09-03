"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var angular2_notifications_1 = require('angular2-notifications');
var index_1 = require('../core/index');
var stats_service_1 = require('../stats/stats.service');
var KlassService = (function () {
    function KlassService(stats, Toasts) {
        this.stats = stats;
        this.Toasts = Toasts;
        this.starterKlass = "Peasant";
        this.klassMap = {};
        for (var _i = 0, KLASSES_1 = index_1.KLASSES; _i < KLASSES_1.length; _i++) {
            var klass = KLASSES_1[_i];
            var k = klass;
            k.unlocked = stats.classUnlocked(k.name);
            this.klassMap[klass.name] = k;
        }
        this.focalKlass = this.klassMap[this.starterKlass];
    }
    Object.defineProperty(KlassService.prototype, "allKlasses", {
        get: function () {
            var klasses = new Array();
            for (var name_1 in this.klassMap) {
                klasses.push(this.klassMap[name_1]);
            }
            return klasses;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KlassService.prototype, "nKlasses", {
        get: function () {
            return index_1.KLASSES.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KlassService.prototype, "nUnlocked", {
        get: function () {
            var n = 0;
            for (var klassname in this.klassMap) {
                n += this.klassMap[klassname].unlocked ? 1 : 0;
            }
            return n;
        },
        enumerable: true,
        configurable: true
    });
    KlassService.prototype.checkUnlocks = function (PS) {
        /** TODO: This is too spammy to log. But just cause it's out of sight,
        doesn't mean it's out of mind. Should return to this at some point and
        review perf implications, and whether there's a more elegant way to do
        this.
        **/
        //console.log("Checking for unlocks");
        for (var _i = 0, KLASSES_2 = index_1.KLASSES; _i < KLASSES_2.length; _i++) {
            var k = KLASSES_2[_i];
            var klass = this.klassMap[k.name];
            if (klass.unlocked) {
                /** It's possible that the unlocked flag was set before the
                unlock requirements changed, and that the player shouldn't
                actually have this class unlocked in their current state.
                But let's just give it to them anyways.
                **/
                continue;
            }
            var unlockScore = klass.criteria(this.stats, PS);
            var didUnlock;
            if (typeof unlockScore == 'number') {
                if (isNaN(unlockScore)) {
                    console.warn("Got score of NaN for " + klass.name);
                    unlockScore = 0;
                }
                klass.progress = unlockScore;
                didUnlock = unlockScore >= 1;
            }
            else {
                didUnlock = unlockScore;
            }
            if (didUnlock) {
                console.log("Wow!! Unlocked " + klass.name);
                this.stats.setClassUnlocked(klass.name);
                if (klass.name != "Peasant") {
                    this.klassUnlockToast(klass);
                }
                klass.progress = undefined;
            }
            klass.unlocked = didUnlock;
        }
    };
    KlassService.prototype.klassUnlockToast = function (klass) {
        // this seems like overkill, but...
        /** TODO: icons are a little small. Would be good to define some
        global style rules for mini/medium/big class icons. **/
        var html = "<div class=\"row\">\n        <div class=\"col-xs-4\">\n        <img src=\"assets/units/" + klass.img + "\">\n        </div>\n        <div class=\"col-cs-8\">\n        <p>New class unlocked!</p>\n        <h3 class=\"toast-klassname\">" + klass.name + "</h3>\n        </div>\n        </div>\n        ";
        this.Toasts.html(html, "success");
    };
    KlassService.prototype.aptitudesForKlass = function (klass) {
        return this.klassMap[klass].aptitudes;
    };
    KlassService.prototype.iconForKlass = function (klass) {
        return 'assets/units/' + this.klassMap[klass].img;
    };
    KlassService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [stats_service_1.StatsService, angular2_notifications_1.NotificationsService])
    ], KlassService);
    return KlassService;
}());
exports.KlassService = KlassService;
//# sourceMappingURL=klass.service.js.map