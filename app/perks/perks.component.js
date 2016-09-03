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
var perk_service_1 = require('./perk.service');
var PerksComponent = (function () {
    function PerksComponent(PRKS) {
        this.PRKS = PRKS;
    }
    PerksComponent.prototype.ngOnInit = function () {
    };
    Object.defineProperty(PerksComponent.prototype, "spells", {
        get: function () {
            return this.PRKS.getSpells();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerksComponent.prototype, "buffs", {
        get: function () {
            return this.PRKS.getBuffs();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerksComponent.prototype, "passives", {
        get: function () {
            return this.PRKS.getPassives();
        },
        enumerable: true,
        configurable: true
    });
    PerksComponent = __decorate([
        core_1.Component({
            selector: 'perks',
            template: "\n    <div class=\"perks\">\n        <h3>Perks</h3>\n\n        <div class=\"buffs\">\n            <div *ngFor=\"let buff of buffs\">\n                <a title=\"{{buff.description}}\">\n                    {{buff.name}}\n                    <span *ngIf=\"buff.remainingTime\">(\n                        {{buff.remainingTime/1000 | number:'1.0-0'}}\n                    )\n                    </span>\n                </a>\n            </div>\n        </div>\n\n        <div class=\"perks\">\n            <div *ngFor=\"let passive of passives\">\n                <a title=\"{{passive.description}}\">\n                    {{passive.name}}\n                </a>\n            </div>\n        </div>\n\n    </div>\n    "
        }), 
        __metadata('design:paramtypes', [perk_service_1.PerkService])
    ], PerksComponent);
    return PerksComponent;
}());
exports.PerksComponent = PerksComponent;
//# sourceMappingURL=perks.component.js.map