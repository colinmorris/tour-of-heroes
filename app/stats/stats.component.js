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
var zones_service_1 = require('../zones/zones.service');
var stats_service_1 = require('./stats.service');
var index_1 = require('../core/index');
var StatsComponent = (function () {
    function StatsComponent(stats, zones) {
        this.stats = stats;
        this.zones = zones;
        this.interestingStatTypes = [
            { stat: index_1.Stat.ActionsTaken, desc: "Actions Taken" },
            { stat: index_1.Stat.Clicks, desc: "Clicks" },
            { stat: index_1.Stat.Reincarnations, desc: "Reincarnations" },
            { stat: index_1.Stat.SpellsCast, desc: "Spells Cast" },
            { stat: index_1.Stat.CriticalActions, desc: "Critical Actions" }
        ];
    }
    Object.defineProperty(StatsComponent.prototype, "interestingStats", {
        get: function () {
            var res = [];
            for (var _i = 0, _a = this.interestingStatTypes; _i < _a.length; _i++) {
                var s = _a[_i];
                var current = s.stat == index_1.Stat.Reincarnations ? "-" : this.stats.current(s.stat);
                res.push({ desc: s.desc,
                    current: current,
                    total: this.stats.lifetimeSum(s.stat)
                });
            }
            return res;
        },
        enumerable: true,
        configurable: true
    });
    StatsComponent.prototype.totalActions = function () {
        // TODO: add these helpers to StatsService
        return this.stats.lifetimeSum(index_1.Stat.ActionsTaken);
    };
    StatsComponent.prototype.currActions = function () {
        return this.stats.current(index_1.Stat.ActionsTaken);
    };
    StatsComponent.prototype.maxLevelPerKlass = function () {
        // TODO: this is dumb, should be a call to klassService
        var keys = [];
        for (var key in this.stats.maxLevelPerKlass()) {
            keys.push(key);
        }
        return keys;
    };
    StatsComponent = __decorate([
        core_1.Component({
            selector: 'stats',
            template: "\n        <h1>Stats</h1>\n        <table class=\"table\">\n            <thead>\n            <tr><th>Stat</th>   <th>This Life</th>  <th>All Time</th></tr>\n            </thead>\n            <tbody>\n            <tr *ngFor=\"let istat of interestingStats\">\n                <td>{{istat.desc}}</td>\n                <td>{{istat.current}}</td>\n                <td>{{istat.total}}</td>\n            </tr>\n            </tbody>\n        </table>\n    "
        }), 
        __metadata('design:paramtypes', [stats_service_1.StatsService, zones_service_1.Zones])
    ], StatsComponent);
    return StatsComponent;
}());
exports.StatsComponent = StatsComponent;
//# sourceMappingURL=stats.component.js.map