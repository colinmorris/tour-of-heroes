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
var stats_service_1 = require('../stats/stats.service');
var perk_service_1 = require('./perk.service');
var SpellsComponent = (function () {
    function SpellsComponent(Perks, Stats) {
        this.Perks = Perks;
        this.Stats = Stats;
    }
    SpellsComponent.prototype.spellTitleText = function (spell) {
        return spell.description + "\n(cooldown=" + spell.cooldown + "s)";
    };
    SpellsComponent.prototype.cooldownString = function (spell) {
        var cd = spell.remainingCooldown;
        if (cd && cd > 0) {
            return "(" + Math.ceil(cd / 1000) + ")";
        }
        else {
            return "";
        }
    };
    SpellsComponent.prototype.cast = function (spell) {
        var success = spell.cast();
        if (success) {
            this.Stats.spellCast();
        }
    };
    Object.defineProperty(SpellsComponent.prototype, "spells", {
        get: function () {
            return this.Perks.getSpells();
        },
        enumerable: true,
        configurable: true
    });
    SpellsComponent = __decorate([
        core_1.Component({
            selector: 'spell-bar',
            styles: ["\n        button {\n            float: right;\n        }\n\n    "],
            template: "\n    <div *ngFor=\"let spell of spells\">\n        <button class=\"btn btn-warning\"\n        [title]=\"spellTitleText(spell)\"\n        [class.disabled]=\"spell.remainingCooldown > 0\"\n        (click)=\"cast(spell)\"\n        >{{spell.name}} {{cooldownString(spell)}}</button>\n    </div>\n    ",
        }), 
        __metadata('design:paramtypes', [perk_service_1.PerkService, stats_service_1.StatsService])
    ], SpellsComponent);
    return SpellsComponent;
}());
exports.SpellsComponent = SpellsComponent;
//# sourceMappingURL=spells.component.js.map