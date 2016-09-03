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
var index_1 = require('../core/index');
var serialization_service_1 = require('../shared/serialization.service');
var stats_data_interface_1 = require('./stats-data.interface');
var globals_1 = require('../globals');
var StatsService = (function () {
    function StatsService(serials) {
        var _this = this;
        var saved = serials.loadStats();
        if (saved && globals_1.GLOBALS.loadSaves) {
            this.stats = saved;
        }
        else {
            this.stats = this.freshStats();
        }
        serials.saveSignaller.subscribe(function () {
            serials.saveStats(_this.stats);
        });
    }
    StatsService.prototype.freshStats = function () {
        var stats = {
            simpleStats: new Array(),
            unlocks: new Array(),
            klassUnlocks: { 'Peasant': true },
            klassLevels: {},
            skillLevels: index_1.uniformSkillMap(0),
            actionStats: {},
            current: new stats_data_interface_1.CurrentLifetimeData()
        };
        for (var s = 0; s < index_1.Stat.MAX; s++) {
            stats.simpleStats[s] = { current: 0, sum: 0 };
        }
        for (var s = 0; s < index_1.NamedUnlock.MAX; s++) {
            stats.unlocks[s] = false;
        }
        return stats;
    };
    // ----------------------- Write --------------------------------
    StatsService.prototype.setSkills = function (levels) {
        for (var i = 0; i < index_1.SkillType.MAX; i++) {
            this.stats.current.skillLevels[i] = levels[i];
            this.stats.skillLevels[i] = Math.max(levels[i], this.stats.skillLevels[i]);
        }
    };
    /** Should only be called on reincarnation to avert a nasty bug with
    heroic ancestry buff. Unfortunately, this behaviour introduces a new,
    not-quite-as-bad bug where class unlock conditions like "reach level X
    as class Y" won't be acknowledged until reincarnation. Could keep two
    trackers if that really matters.
    **/
    StatsService.prototype.setLevel = function (level, klass) {
        var simple = this.stats.simpleStats[index_1.Stat.PlayerLevel];
        simple.sum += (level - simple.current);
        simple.current = level;
        this.stats.klassLevels[klass] = Math.max(level, this.stats.klassLevels[klass] || 0);
    };
    StatsService.prototype.spellCast = function () {
        this.incrementSimpleStat(index_1.Stat.SpellsCast);
    };
    StatsService.prototype.itemFound = function () {
    };
    StatsService.prototype.crittedAction = function () {
        this.incrementSimpleStat(index_1.Stat.CriticalActions);
    };
    StatsService.prototype.clicked = function () {
        this.incrementSimpleStat(index_1.Stat.Clicks);
    };
    StatsService.prototype.actionTaken = function (zone) {
        this.incrementSimpleStat(index_1.Stat.ActionsTaken);
        if (!(zone in this.stats.actionStats)) {
            this.stats.actionStats[zone] = { current: 0, sum: 0 };
        }
        this.incrementStatCell(this.stats.actionStats[zone]);
    };
    StatsService.prototype.reincarnated = function () {
        this.incrementSimpleStat(index_1.Stat.Reincarnations);
        this.resetEphemeralStats();
    };
    StatsService.prototype.leveledZone = function (zoneName, toLevel) {
        this.stats.current.zoneLevels[zoneName] = toLevel;
    };
    StatsService.prototype.incrementSimpleStat = function (stat) {
        this.incrementStatCell(this.stats.simpleStats[stat]);
    };
    StatsService.prototype.incrementStatCell = function (cell) {
        cell.current += 1;
        cell.sum += 1;
    };
    /** Resets to zero all stats that describe the current lifetime. Called on
    reincarnation. **/
    StatsService.prototype.resetEphemeralStats = function () {
        this.stats.current = new stats_data_interface_1.CurrentLifetimeData();
        for (var s = 0; s < index_1.Stat.MAX; s++) {
            this.stats.simpleStats[s].current = 0;
        }
    };
    StatsService.prototype.unlock = function (u) {
        if (!this.stats.unlocks[u]) {
            console.log("New named unlock! " + index_1.NamedUnlock[u]);
        }
        this.stats.unlocks[u] = true;
    };
    StatsService.prototype.setClassUnlocked = function (klass) {
        this.stats.klassUnlocks[klass] = true;
    };
    StatsService.prototype.setOneShot = function (oneshot) {
        this.stats.current.oneShots[oneshot] = true;
    };
    // ----------------------- Read --------------------------------
    StatsService.prototype.current = function (s) {
        if (!(s in this.stats.simpleStats)) {
            console.warn("Couldn't find " + s + " in simpleStats. Save version\n            incompatibility? Adding an empty cell for it.");
            if (s > this.stats.simpleStats.length) {
                console.error("TODO: Ugh I should fix this.");
            }
            this.stats.simpleStats[s] = { current: 0, sum: 0 };
        }
        return this.stats.simpleStats[s].current;
    };
    StatsService.prototype.lifetimeSum = function (s) {
        if (!(s in this.stats.simpleStats)) {
            console.warn("Couldn't find " + s + " in simpleStats. Save version\n            incompatibility? Adding an empty cell for it.");
            if (s > this.stats.simpleStats.length) {
                console.error("TODO: Ugh I should fix this.");
            }
            this.stats.simpleStats[s] = { current: 0, sum: 0 };
        }
        return this.stats.simpleStats[s].sum;
    };
    StatsService.prototype.classUnlocked = function (klass) {
        return klass in this.stats.klassUnlocks;
    };
    StatsService.prototype.unlocked = function (u) {
        return this.stats.unlocks[u];
    };
    StatsService.prototype.performedOneShot = function (oneshot) {
        return this.stats.current.oneShots[oneshot];
    };
    StatsService.prototype.playerLevel = function (klass) {
        return this.stats.klassLevels[klass] || 0;
    };
    StatsService.prototype.maxLevelPerKlass = function () {
        return this.stats.klassLevels;
    };
    StatsService.prototype.maxLevels = function () {
        var levels = new Array();
        for (var klass in this.stats.klassLevels) {
            levels.push(this.stats.klassLevels[klass]);
        }
        return levels;
    };
    StatsService.prototype.skillLevel = function (skill) {
        return this.stats.skillLevels[skill];
    };
    StatsService.prototype.actionsTaken = function (zone) {
        if (!(zone in this.stats.actionStats)) {
            return 0;
        }
        return this.stats.actionStats[zone].current;
    };
    StatsService.prototype.lifetimeSumActionsTaken = function (zone) {
        if (!(zone in this.stats.actionStats)) {
            return 0;
        }
        return this.stats.actionStats[zone].sum;
    };
    /** We have some unlock conditioned on reaching level X in skill Y.
        If we've already done so (in any lifetime), return True. Otherwise,
        return a number in [0,1) describing our progress with respect to our
        *current* skill levels (not lifetime max). This is a more helpful number
        to show to the player.
    **/
    StatsService.prototype.checkSkillUnlock = function (skill, threshold) {
        if (this.stats.skillLevels[skill] >= threshold) {
            return true;
        }
        else {
            return this.stats.current.skillLevels[skill] / threshold;
        }
    };
    Object.defineProperty(StatsService.prototype, "ziTokens", {
        get: function () {
            return this.stats.current.ziTokens;
        },
        set: function (n) {
            this.stats.current.ziTokens = n;
        },
        enumerable: true,
        configurable: true
    });
    StatsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [serialization_service_1.SerializationService])
    ], StatsService);
    return StatsService;
}());
exports.StatsService = StatsService;
//# sourceMappingURL=stats.service.js.map