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
var player_component_1 = require('../player/player.component');
var zones_component_1 = require('../zones/zones.component');
var zone_component_1 = require('../zones/zone.component');
var zones_service_1 = require('../zones/zones.service');
var HomeComponent = (function () {
    function HomeComponent(zones) {
        this.zones = zones;
    }
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'home',
            directives: [player_component_1.PlayerComponent, zones_component_1.ZonesComponent, zone_component_1.ZoneComponent],
            styles: [
                ".focalZone {\n            margin-bottom: 30px;\n        }"
            ],
            template: "\n    <div class=\"row\">\n        <div class=\"col-xs-3\">\n            <player-pane></player-pane>\n        </div>\n        <div class=\"col-xs-9\">\n                <div class=\"focalZone\">\n                    <zone *ngIf=\"zones.focalZone\" [zone]=\"zones.focalZone\"></zone>\n                </div>\n                <zones></zones>\n        </div>\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [zones_service_1.Zones])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map