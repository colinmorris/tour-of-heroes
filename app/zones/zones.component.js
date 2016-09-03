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
var zones_service_1 = require('./zones.service');
var zone_summary_component_1 = require('./zone-summary.component');
var player_service_1 = require('../player/player.service');
var globals_1 = require('../globals');
var ZonesComponent = (function () {
    function ZonesComponent(zones, PS) {
        var _this = this;
        this.zones = zones;
        this.PS = PS;
        this.panes = new Array();
        /** I keep trying to push logic into ngOnInit, because some part of
        the tutorial told me to do that, but it always seems to lead to weird,
        hard-to-understand fuckups, so here we are.
        **/
        console.assert(this.panes.length == 0);
        for (var _i = 0, _a = this.zones.superzones; _i < _a.length; _i++) {
            var superz = _a[_i];
            this.panes.push({
                name: superz.name, unlocked: superz.unlockCondition(this.PS.player.level),
                zones: superz.zones, unlockDescription: superz.unlockDescription
            });
        }
        this.activePane = this.panes[0];
        console.assert(this.activePane.unlocked);
        // On level up, check whether any new superzones have been unlocked.
        this.PS.playerLevel$.subscribe(function (lvl) {
            for (var i = 0; i < _this.panes.length; i++) {
                _this.panes[i].unlocked = _this.zones.superzones[i].
                    unlockCondition(_this.PS.player.level);
            }
        });
    }
    /** Only show unlocked panes plus the *first* locked pane (i.e. the one
    that will be unlocked next). **/
    ZonesComponent.prototype.visiblePanes = function () {
        var vis = [];
        for (var _i = 0, _a = this.panes; _i < _a.length; _i++) {
            var pane = _a[_i];
            if (pane.unlocked || globals_1.GLOBALS.cheatMode) {
                vis.push(pane);
            }
            else {
                vis.push(pane);
                break;
            }
        }
        return vis;
    };
    ZonesComponent.prototype.ngOnInit = function () {
    };
    ZonesComponent = __decorate([
        core_1.Component({
            selector: 'zones',
            directives: [zone_summary_component_1.ZoneSummaryComponent],
            styles: [
                "\n        .zone-header {\n            font-weight: bold;\n        }\n        .locked {\n            opacity: .5; /* placeholder */\n        }\n        ",],
            template: "\n    <div>\n\n    <ul class=\"nav nav-tabs\">\n        <li *ngFor=\"let pane of visiblePanes()\"\n        [class.active]=\"activePane==pane\"\n        [class.locked]=\"!pane.unlocked\"\n         >\n            <a (click)=\"activePane=pane\"\n            [title]=\"pane.unlockDescription\"\n            >{{pane.name}}</a>\n        </li>\n    </ul>\n\n    <div class=\"tab-content\">\n        <div *ngFor=\"let pane of panes\"\n         class=\"tab-pane\"\n         [class.active]=\"activePane==pane\"\n         >\n            <ul *ngIf=\"activePane==pane\" class=\"list-group\">\n                <li class=\"list-group-item zone-header\">\n                <div class=\"row\">\n                    <div class=\"col-xs-2\">Zone</div>\n                    <div class=\"col-xs-1\">Level</div>\n                    <div class=\"col-xs-4\">Skills</div>\n                    <div class=\"col-xs-2\"\n                    title=\"If your skill levels are too low, actions will take longer\"\n                    >Slowdown</div>\n                    <div class=\"col-xs-3\"></div>\n                </div>\n                </li>\n\n                <li *ngFor=\"let zone of pane.zones\" class=\"list-group-item\">\n                    <zone-summary [zone]=\"zone\" [youAreHere]=\"zones.focalZone==zone\"\n                    [locked]=\"!pane.unlocked\">\n                    </zone-summary>\n                </li>\n            </ul>\n        </div>\n    </div>\n\n    </div>\n    "
        }), 
        __metadata('design:paramtypes', [zones_service_1.Zones, player_service_1.PlayerService])
    ], ZonesComponent);
    return ZonesComponent;
}());
exports.ZonesComponent = ZonesComponent;
//# sourceMappingURL=zones.component.js.map