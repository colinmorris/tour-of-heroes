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
var klass_service_1 = require('../klasses/klass.service');
var stats_service_1 = require('../stats/stats.service');
var serialization_service_1 = require('../shared/serialization.service');
var player_1 = require('./player');
var globals_1 = require('../globals');
var index_1 = require('../core/index');
var PlayerService = (function () {
    function PlayerService(klasses, stats, Toasts, serials) {
        var _this = this;
        this.klasses = klasses;
        this.stats = stats;
        this.Toasts = Toasts;
        this.serials = serials;
        var saved = serials.loadPlayer();
        var player;
        if (saved && globals_1.GLOBALS.loadSaves) {
            player = player_1.LivePlayer.fromJSON(saved);
        }
        else {
            console.log("Starting fresh");
            player = this.startingPlayer();
        }
        this.setPlayer(player);
        serials.saveSignaller.subscribe(function () {
            serials.savePlayer(_this.toJSON());
        });
    }
    Object.defineProperty(PlayerService.prototype, "player", {
        get: function () {
            return this._player;
        },
        enumerable: true,
        configurable: true
    });
    PlayerService.prototype.startingPlayer = function () {
        var klass = this.klasses.starterKlass;
        var aptitudes = this.klasses.aptitudesForKlass(klass);
        return player_1.LivePlayer.newborn("Coolin", klass, aptitudes);
    };
    // Called on service init and on reincarnation.
    PlayerService.prototype.setPlayer = function (player) {
        var _this = this;
        this._player = player;
        this.playerLevel$ = this._player.level$.asObservable();
        this.playerLevel$.subscribe(function (lvl) {
            // Actually won't do this until reincarnation.
            //this.stats.setLevel(lvl, this._player.klass);
            // TODO: This is lazy. Simple solution would be to just have
            // player publish to level$ whenever skill levels go up
            _this.stats.setSkills(_this._player.baseSkillLevels());
        });
        // This is a pretty arbitrary place to put this.
        // Also, this is pretty hacky. But tested and seems to work.
        var first = true;
        this.playerLevel$.subscribe(function (lvl) {
            if (first) {
                first = false;
            }
            else if (lvl >= globals_1.GLOBALS.zoneLevelingMinLevel && (lvl % 5) == 0) {
                console.log("You earned a Zi token. Yay.");
                _this.stats.ziTokens++;
                _this.Toasts.info("Level " + lvl, "Gained a Zone Improvement token", {
                    timeOut: 5000
                });
            }
        });
    };
    PlayerService.prototype.toJSON = function () {
        return this._player.toJSON();
    };
    // ---------------------- Accessors -------------------------
    PlayerService.prototype.getSkillLevel = function (s) {
        return this._player.skills[s].level;
    };
    PlayerService.prototype.getSkillLevels = function () {
        return this._player.skills.map(function (skill) {
            return skill.level;
        });
    };
    PlayerService.prototype.getBaseAptitudes = function () {
        return this._player.skills.map(function (s) {
            return s.baseAptitude;
        });
    };
    PlayerService.prototype.canLevelZones = function () {
        return this._player.level >= globals_1.GLOBALS.zoneLevelingMinLevel;
    };
    // ---------------------- Mutators -------------------------
    PlayerService.prototype.buffAptitudes = function (by) {
        this._player.buffAptitudes(by);
    };
    PlayerService.prototype.debuffAptitudes = function (by) {
        this._player.buffAptitudes(by.map(function (apt) { return -1 * apt; }));
    };
    PlayerService.prototype.buffSkillLevels = function (by) {
        this._player.buffSkillLevels(by);
    };
    PlayerService.prototype.buffSkillLevel = function (skill, levels) {
        var buffs = index_1.mostlyUniformSkillMap(0, (_a = {}, _a[skill] = levels, _a));
        this.buffSkillLevels(buffs);
        var _a;
    };
    PlayerService.prototype.trainSkills = function (basePoints) {
        return this._player.applySkillPoints(basePoints);
    };
    PlayerService.prototype.trainSkill = function (skill, basePoints) {
        var sp = index_1.zeroSkillMap();
        sp[skill] = basePoints;
        return this.trainSkills(sp);
    };
    PlayerService.prototype.reincarnate = function (klass) {
        var aptitudes = this.klasses.aptitudesForKlass(klass);
        var player = player_1.LivePlayer.newborn("Coolin", klass, aptitudes);
        this.setPlayer(player);
    };
    PlayerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [klass_service_1.KlassService, stats_service_1.StatsService, angular2_notifications_1.NotificationsService, serialization_service_1.SerializationService])
    ], PlayerService);
    return PlayerService;
}());
exports.PlayerService = PlayerService;
//# sourceMappingURL=player.service.js.map