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
var Subject_1 = require('rxjs/Subject');
var ReplaySubject_1 = require('rxjs/ReplaySubject');
var globals_1 = require('../globals');
var player_service_1 = require('../player/player.service');
var stats_service_1 = require('../stats/stats.service');
var index_1 = require('../core/index');
var reallivezoneaction_1 = require('./reallivezoneaction');
var ActionService = (function () {
    function ActionService(PS, stats) {
        this.PS = PS;
        this.stats = stats;
        // Replays the one last action
        this.postActionSubject = new ReplaySubject_1.ReplaySubject(1);
        this._actionSpeedMultiplier = 1.0;
        // Inexperience penalty multiplied by this amount
        this.inexpMultiplier = 1.0;
        this.eggs = 0;
        // Experimental
        this.protoActionOutcomeSubject = new Subject_1.Subject();
    }
    Object.defineProperty(ActionService.prototype, "actionSpeedMultiplier", {
        get: function () {
            return this._actionSpeedMultiplier;
        },
        set: function (newValue) {
            console.assert(newValue > 0 && this._actionSpeedMultiplier > 0);
            var speedup = newValue / this._actionSpeedMultiplier;
            if (this.currentAction) {
                this.currentAction.adjustRemainingTime(speedup);
            }
            this._actionSpeedMultiplier = newValue;
        },
        enumerable: true,
        configurable: true
    });
    // ------------------- ACTION BOOKKEEPING --------------------------
    /** Immediately terminate any action running in this zone, and stop
    looping actions for that zone. **/
    ActionService.prototype.stopActionLoop = function (zone) {
        // TODO: would be cool to define a decorator that says "this is
        // a no-op if there's no actions going on right now"
        if (!this.activeZone || this.activeZone != zone) {
            return;
        }
        this.activeZone = undefined;
        this.currentAction.kill();
        this.currentAction = undefined;
    };
    ActionService.prototype.stopAllActions = function () {
        if (this.activeZone) {
            this.stopActionLoop(this.activeZone);
        }
    };
    /** Return the currently running action in the given zone, if any **/
    ActionService.prototype.ongoingActionForZone = function (zone) {
        if (this.activeZone && zone.zid == this.activeZone.zid) {
            return this.currentAction;
        }
        return undefined;
    };
    ActionService.prototype.startActionLoop = function (zone) {
        this.stopAllActions();
        this.activeZone = zone;
        this.currentAction = this.runActionLoop();
        return this.currentAction;
    };
    ActionService.prototype.runActionLoop = function () {
        var _this = this;
        var zoneaction = this.chooseActionType(this.activeZone);
        var desc = zoneaction.chooseDescription();
        var delay = this.getDelay(zoneaction);
        var cb = function () {
            var outcome = _this.getOutcome(zoneaction, desc.past); // bleh
            var nextAction = _this.runActionLoop();
            var post = { outcome: outcome, nextAction: nextAction };
            _this.postActionSubject.next(post);
            _this.stats.actionTaken(_this.activeZone.name);
        };
        var action = new reallivezoneaction_1.RealLiveZoneAction(desc.present, delay.delay, cb, this.activeZone.zid, delay.slowdown);
        this.currentAction = action;
        return action;
    };
    // ------------------- ACTION MECHANICS --------------------------
    ActionService.prototype.getDelay = function (action) {
        var slowdown = action.slowdown(this.PS.player);
        slowdown *= this.inexpMultiplier;
        var skillAdjustedDelay = (slowdown + 1) * globals_1.GLOBALS.defaultBaseZoneDelay;
        var buffedDelay = skillAdjustedDelay / this.actionSpeedMultiplier;
        if (skillAdjustedDelay != buffedDelay) {
            console.log("Delay buffed: " + buffedDelay);
        }
        return { delay: buffedDelay, slowdown: slowdown };
    };
    ActionService.prototype.getOutcome = function (action, mainDesc) {
        var proto = { action: action,
            kickers: new Array(),
            zone: this.activeZone,
            spMultiplier: 1
        };
        // By broadcasting this, we give observers the chance to mutate it
        // (by adding secondary effects), before we apply. Probably before.
        // Still not clear on the rxjs scheduler stuff.
        this.protoActionOutcomeSubject.next(proto);
        if (action.unlocks) {
            this.stats.unlock(action.unlocks);
        }
        if (action.oneshot) {
            this.stats.setOneShot(action.oneshot);
        }
        // I can already tell this is going to turn into a fucking monster
        // of a method
        // Was originally 100x, reducing since we increased default action duration
        if (this.currentAction.slowdown > 20.0) {
            this.stats.unlock(index_1.NamedUnlock.SuperSlowAction);
        }
        // Such a hack
        if (this.activeZone.name == "Gryphon Nest" &&
            action.skillDeltas[index_1.SkillType.Stealth] > 0) {
            this.eggs++;
            if (this.eggs == 3) {
                this.stats.unlock(index_1.NamedUnlock.ThreeEggs);
            }
        }
        else {
            this.eggs = 0;
        }
        var crit = this.checkCrits(proto);
        // TODO: XXX: Probably want to pass this on in some more structured way
        // to the UI, and maybe some perk listeners or something. Being lazy for now.
        if (crit) {
            mainDesc += ' CRIT!';
        }
        var spBoost = function (s, mlt) { return s.map(function (sp) { return sp * mlt; }); };
        var mainEvent = { description: mainDesc,
            pointsGained: this.PS.trainSkills(spBoost(action.skillDeltas, proto.spMultiplier * this.currentAction.spMultiplier)) };
        var kickerEvents = new Array();
        for (var _i = 0, _a = proto.kickers; _i < _a.length; _i++) {
            var secondary = _a[_i];
            var kickerOutcome = { description: secondary.description };
            if (secondary.skillPoints) {
                kickerOutcome.pointsGained = this.PS.trainSkills(spBoost(secondary.skillPoints, proto.spMultiplier));
            }
            kickerEvents.push(kickerOutcome);
        }
        var outcome = { main: mainEvent, secondary: kickerEvents };
        return outcome;
    };
    ActionService.prototype.checkCrits = function (proto) {
        if (Math.random() < this.PS.player.meta.critChance) {
            /** TODO: seems like the crit multiplier should probably only
                apply to SP from the main outcome, and not from kickers. **/
            proto.spMultiplier *= this.PS.player.meta.critMultiplier;
            this.stats.crittedAction();
            return true;
        }
        else {
            return false;
        }
    };
    ActionService.prototype.chooseActionType = function (zone) {
        var action = zone.chooseAction();
        var tries = 1;
        var maxTries = 20;
        /** Note: This is a good reason to not use the oneshot property for
            high-probability actions. Could work around this cleanly, but it's
            a little tedious, so I'm just doing this the lazy way.
        **/
        while ((action.oneshot && this.stats.performedOneShot(action.oneshot))
            && tries++ < maxTries) {
            action = zone.chooseAction();
        }
        if (tries == maxTries) {
            console.error("Got a used oneshot action every time after\n                " + maxTries + " tries. Either this is a bug or we got spectacularly\n                unlucky.");
        }
        return action;
    };
    ActionService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [player_service_1.PlayerService, stats_service_1.StatsService])
    ], ActionService);
    return ActionService;
}());
exports.ActionService = ActionService;
//# sourceMappingURL=action.service.js.map