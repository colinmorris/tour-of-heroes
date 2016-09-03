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
var player_token = "toh_playerdata";
var stats_token = "toh_statsdata";
var ENCRYPT = false;
function rot1(s) {
    return s.split('').map(function (_) {
        var c = _.charCodeAt(0);
        return String.fromCharCode(c + 1);
    }).join('');
}
function derot1(s) {
    return s.split('').map(function (_) {
        var c = _.charCodeAt(0);
        return String.fromCharCode(c - 1);
    }).join('');
}
var SerializationService = (function () {
    function SerializationService() {
        this.saveSignaller = new Subject_1.Subject();
        this.saveTokens = [player_token, stats_token];
    }
    SerializationService.prototype.save = function () {
        // TODO: This seems silly. Gotta be a better way.
        this.saveSignaller.next(true);
    };
    SerializationService.prototype.clearSave = function () {
        for (var _i = 0, _a = this.saveTokens; _i < _a.length; _i++) {
            var token = _a[_i];
            localStorage.removeItem(token);
        }
    };
    SerializationService.prototype.saveStats = function (stats) {
        localStorage.setItem(stats_token, JSON.stringify(stats));
    };
    SerializationService.prototype.loadStats = function () {
        console.log("Loading stats");
        var serialized = localStorage.getItem(stats_token);
        return JSON.parse(serialized);
    };
    SerializationService.prototype.savePlayer = function (player) {
        localStorage.setItem(player_token, JSON.stringify(player));
    };
    SerializationService.prototype.loadPlayer = function () {
        console.log("Loading player");
        var serialized = localStorage.getItem(player_token);
        return JSON.parse(serialized);
    };
    SerializationService.prototype.loadGameData = function () {
        return {
            stats: this.loadStats(),
            player: this.loadPlayer()
        };
    };
    SerializationService.prototype.exportToString = function () {
        var gd = this.loadGameData();
        var s = JSON.stringify(gd);
        if (ENCRYPT) {
            s = rot1(s);
        }
        return s;
    };
    SerializationService.prototype.loadFromString = function (enc) {
        var decoded = enc;
        if (ENCRYPT) {
            decoded = derot1(enc);
        }
        var gd = JSON.parse(decoded);
        this.savePlayer(gd.player);
        this.saveStats(gd.stats);
    };
    SerializationService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SerializationService);
    return SerializationService;
}());
exports.SerializationService = SerializationService;
//# sourceMappingURL=serialization.service.js.map