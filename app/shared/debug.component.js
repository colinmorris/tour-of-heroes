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
var globals_1 = require('../globals');
var stats_service_1 = require('../stats/stats.service');
var serialization_service_1 = require('./serialization.service');
var index_1 = require('../core/index');
var DebugComponent = (function () {
    function DebugComponent(Stats, Cereal) {
        this.Stats = Stats;
        this.Cereal = Cereal;
        this.statsString = false;
        this.nClasses = 0;
        this.levelPerClass = 10;
        this.maxSkillLvl = 50;
        this.cheatMode = globals_1.GLOBALS.cheatMode;
    }
    DebugComponent.prototype.loadFromString = function () {
        if (!this.stringToLoad) {
            console.warn("Nothing to load");
            return;
        }
        this.Cereal.loadFromString(this.stringToLoad);
        location.reload();
    };
    DebugComponent.prototype.statsJson = function () {
        //return JSON.stringify(this.Stats.stats);
        return this.Cereal.exportToString();
    };
    DebugComponent.prototype.ancestryBonus = function () {
        var plvls = [];
        for (var i = 0; i < this.nClasses; i++) {
            plvls.push(this.levelPerClass);
        }
        return index_1.ancestryBonus(plvls);
    };
    DebugComponent.prototype.levelingData = function () {
        var dat = [];
        var anc = this.ancestryBonus();
        for (var lvl = 0; lvl <= this.maxSkillLvl; lvl += 5) {
            var serving = index_1.XpFormulas.standardSpServingForSkillLevel(lvl) * (1 + anc);
            var toLvl = index_1.XpFormulas.skillPointsToAdvanceLevel(lvl);
            dat.push({
                lvl: lvl,
                serving: serving,
                toLvl: toLvl,
                actions: toLvl / serving
            });
        }
        return dat;
    };
    DebugComponent = __decorate([
        core_1.Component({
            selector: 'debug-pane',
            template: "\n    <h1 *ngIf=\"!cheatMode\">What are you doing here? Shoo!</h1>\n    <div *ngIf=\"cheatMode\">\n\n    ZI Tokens: {{Stats.ziTokens}}\n    <button (click)=\"Stats.ziTokens = Stats.ziTokens+1\">Get token</button>\n\n    <table class=\"table table-striped\">\n    <tr>\n    <th>Skill Level</th>  <th>Standard SP</th>    <th>SP to lvl</th> <th>Actions to lvl</th>\n    </tr>\n\n    <tr *ngFor=\"let row of levelingData()\">\n        <td>{{row.lvl}}</td>\n        <td>{{row.serving | number:'1.0-1'}}</td>\n        <td>{{row.toLvl | number:'1.0-1'}}</td>\n        <td>{{row.actions | number:'1.0-0'}}</td>\n    </tr>\n    <label>n classes\n        <input type=\"text\"\n            [(ngModel)]=\"nClasses\"\n        ></label>\n    <label>level per class\n        <input type=\"text\"\n            [(ngModel)]=\"levelPerClass\"\n        ></label>\n    <label>Max skill level\n        <input type=\"text\"\n            [(ngModel)]=\"maxSkillLvl\"\n        ></label>\n    <p>Ancestry bonus: {{ancestryBonus() | number:'1.0-1'}}</p>\n\n    </table>\n\n    <button (click)=\"statsString=!statsString\">Stats JSON</button>\n    <div *ngIf=\"statsString\">\n        <code>{{statsJson()}}</code>\n    </div>\n    <textarea [(ngModel)]=\"stringToLoad\"></textarea>\n    <button (click)=\"loadFromString()\">Load</button>\n    </div>\n    ",
        }), 
        __metadata('design:paramtypes', [stats_service_1.StatsService, serialization_service_1.SerializationService])
    ], DebugComponent);
    return DebugComponent;
}());
exports.DebugComponent = DebugComponent;
//# sourceMappingURL=debug.component.js.map