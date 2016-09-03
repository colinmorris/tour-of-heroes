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
var router_1 = require('@angular/router');
var Observable_1 = require('rxjs/Observable');
//import { Overlay } from 'angular2-modal';
var index_1 = require('angular2-modal/plugins/bootstrap/index');
var player_service_1 = require('../player/player.service');
var zones_service_1 = require('../zones/zones.service');
var action_service_1 = require('../actions/action.service');
var klass_service_1 = require('../klasses/klass.service');
var perk_service_1 = require('../perks/perk.service');
var stats_service_1 = require('../stats/stats.service');
var serialization_service_1 = require('./serialization.service');
require('../rxjs-operators');
var di_tokens_1 = require('./di-tokens');
var globals_1 = require('../globals');
var index_2 = require('../core/index');
var AppComponent = (function () {
    function AppComponent(serials, Stats, PS, KS, modal) {
        this.serials = serials;
        this.Stats = Stats;
        this.PS = PS;
        this.KS = KS;
        this.modal = modal;
        this.cheatMode = globals_1.GLOBALS.cheatMode;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (globals_1.GLOBALS.autoSave) {
            Observable_1.Observable.interval(globals_1.GLOBALS.autoSaveIntervalMs).subscribe(function () {
                _this.serials.save();
            });
        }
        Observable_1.Observable.interval(globals_1.GLOBALS.unlockCheckInterval).subscribe(function () {
            // TODO: this kinda sucks
            _this.KS.checkUnlocks(_this.PS);
            /** TODO: this also sucks. Really should be an observable for
            named unlocks. **/
            if (_this.Stats.unlocked(index_2.NamedUnlock.SpaceTimeConquered) &&
                !_this.Stats.unlocked(index_2.NamedUnlock.BeatTheGameCongrats)) {
                _this.Stats.unlock(index_2.NamedUnlock.BeatTheGameCongrats);
                _this.beatTheGameModal();
            }
        });
        this.lvl10sub = this.PS.playerLevel$.subscribe(function (lvl) {
            if (lvl == globals_1.GLOBALS.reincarnationMinLevel &&
                !_this.Stats.unlocked(index_2.NamedUnlock.ReincarnationAvailableHelp)) {
                _this.reincarnationModal();
                _this.Stats.unlock(index_2.NamedUnlock.ReincarnationAvailableHelp);
            }
            if (lvl == globals_1.GLOBALS.zoneLevelingMinLevel &&
                !_this.Stats.unlocked(index_2.NamedUnlock.ZoneLevelingHelp)) {
                _this.zoneLevelingModal();
                _this.Stats.unlock(index_2.NamedUnlock.ZoneLevelingHelp);
            }
        });
    };
    AppComponent.prototype.beatTheGameModal = function () {
        var email = 'colin' + '.' + 'morris' + (1 + 1) + '@gmail.com';
        this.modal.alert()
            .size('lg')
            .showClose(true)
            .title("Congratulations")
            .body("<p>You beat the game! That's it for now.</p>\n            <p>There may be more endgame content coming at some point, including\n            prestiging and \"dual class\" mechanics, so check back later.\n            </p>\n            <p>If you enjoyed the game and have ideas about what you'd like to\n            see added, or balance suggestions, <a href=\"mailto:" + email + "\">\n            let me know</a>.</p>\n            ")
            .open();
    };
    AppComponent.prototype.zoneLevelingModal = function () {
        this.modal.alert()
            .size('lg')
            .showClose(true)
            .title("Level " + globals_1.GLOBALS.zoneLevelingMinLevel + "!")
            .body("<p>You've earned a <b>Zone Improvement Token</b>. You'll get\n            one at level 25, and every 5th level after that. You can spend a\n            token to 'level up' a zone, increasing its difficulty and the skill\n            points it awards.</p>\n            <p>You can't take them with you - tokens reset to 0 on reincarnation,\n            so spend them while you can.</p>")
            .open();
    };
    AppComponent.prototype.reincarnationModal = function () {
        /** TODO: Anchor links to Classes pane don't really work here, since
        they cause a page reload. Boo. Maybe I should just use hashtag
        navigation. Would also help with some of the quirks that come
        with gh-pages + single page sites.
        **/
        var s = this.KS.nUnlocked > 1 ?
            "Looks like you've already unlocked a new class. Head over to the\n            Classes tab to start a new life. Or if you have no desire for\n            upward mobility, feel free to keep living that Peasant life..."
            :
                "Looks like you haven't unlocked any classes yet. Head over to the\n            Classes tab for some unlock hints. If you really want, you can\n            reincarnate into a level 1 Peasant (also in Classes)\n            and start again with a slight boost to your aptitudes.";
        this.modal.alert()
            .size('lg')
            .showClose(true)
            .title("Level " + globals_1.GLOBALS.reincarnationMinLevel + "!")
            .body("<p>Congratulations on reaching level " + globals_1.GLOBALS.reincarnationMinLevel + ".\n                You're ready to <b>reincarnate</b>. Reincarnation lets you live a\n                new life as a different class. After your first reincarnation, you'll\n                start receiving a boost to your aptitudes based on the highest level\n                you've reached with each class - it pays to unlock and level as\n                many classes as possible.</p>\n                <p>" + s + "</p>\n                ").open();
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            directives: [router_1.ROUTER_DIRECTIVES],
            styles: ["\n        .save {\n            margin-top: 15px;\n        }\n        /* TODO: this is hacky in every respect */\n        >>> .toast-klassname {\n            margin-left: 110px;\n        }\n    "],
            template: "\n    <span defaultOverlayTarget></span>\n    <simple-notifications></simple-notifications>\n    <div class=\"container\">\n    <ul class=\"nav nav-pills\">\n        <li [routerLinkActive]=\"['active']\" [routerLinkActiveOptions]=\"{exact:true}\">\n            <a [routerLink]=\"['/']\">Home</a></li>\n        <li [routerLinkActive]=\"['active']\"><a [routerLink]=\"['/classes']\">Classes</a></li>\n        <li [routerLinkActive]=\"['active']\"><a [routerLink]=\"['/stats']\">Stats</a></li>\n        <li [routerLinkActive]=\"['active']\"><a [routerLink]=\"['/about']\">About</a></li>\n        <li [routerLinkActive]=\"['active']\"><a [routerLink]=\"['/debug']\" *ngIf=\"cheatMode\">Debug</a></li>\n    </ul>\n    <router-outlet></router-outlet>\n    <div class=\"row save\" *ngIf=\"cheatMode\">\n    <button (click)=\"serials.save()\">Save</button>\n    <button (click)=\"serials.clearSave()\">Clear Save</button>\n    </div>\n    </div>\n  ",
            providers: [index_1.Modal,
                zones_service_1.Zones, klass_service_1.KlassService, serialization_service_1.SerializationService,
                stats_service_1.StatsService,
                { provide: di_tokens_1.di_tokens.statsservice, useExisting: stats_service_1.StatsService },
                perk_service_1.PerkService,
                { provide: di_tokens_1.di_tokens.perkservice, useExisting: perk_service_1.PerkService },
                player_service_1.PlayerService,
                { provide: di_tokens_1.di_tokens.playerservice, useExisting: player_service_1.PlayerService },
                action_service_1.ActionService,
                { provide: di_tokens_1.di_tokens.actionservice, useExisting: action_service_1.ActionService }
            ]
        }), 
        __metadata('design:paramtypes', [serialization_service_1.SerializationService, stats_service_1.StatsService, player_service_1.PlayerService, klass_service_1.KlassService, index_1.Modal])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map