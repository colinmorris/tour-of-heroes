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
var action_service_1 = require('../actions/action.service');
var player_service_1 = require('../player/player.service');
var stats_service_1 = require('../stats/stats.service');
var skill_gains_pipe_1 = require('./skill-gains.pipe');
var globals_1 = require('../globals');
var ZoneComponent = (function () {
    function ZoneComponent(AS, PS, Stats) {
        this.AS = AS;
        this.PS = PS;
        this.Stats = Stats;
        this.levelUpExpanded = false;
        this.loaded = false;
        this.cheatMode = globals_1.GLOBALS.cheatMode;
    }
    ZoneComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.assert(this.actionsub === undefined);
        this.actionsub = this.AS.postActionSubject
            .filter(function (post) {
            return post.nextAction.zid == _this.zone.zid;
        })
            .subscribe({
            next: function (post) {
                if (post.nextAction.active) {
                    /** TODO: Can we relieve RLZA of the burden of tracking
                    animation stuff, and take care of it here?
                    **/
                    _this.currentAction = post.nextAction;
                    _this.lastOutcome = post.outcome;
                }
                console.assert(post.nextAction.zid == _this.zone.zid);
            }
        });
        this.loaded = true;
    };
    ZoneComponent.prototype.canLevelZone = function () {
        return this.Stats.ziTokens > 0;
    };
    ZoneComponent.prototype.ngOnDestroy = function () {
        if (this.actionsub) {
            this.actionsub.unsubscribe();
        }
    };
    ZoneComponent.prototype.masteryIncreasePerZoneLevel = function () {
        return Math.ceil(globals_1.GLOBALS.difficultyBonusPerZoneLevel * index_1.XpFormulas.benchmarkSkillLevelForPlevel(1));
    };
    // this kind of sucks. Would like it if we could just create a new component
    // every time the zone changes
    ZoneComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        console.assert("zone" in changes);
        this.levelUpExpanded = false;
        if (this.currentAction) {
            this.currentAction = undefined;
            this.lastOutcome = undefined;
        }
        else {
            // possible this is causing a race condition?
            this.AS.postActionSubject.take(1).subscribe({
                next: function (post) {
                    if (post.nextAction.active &&
                        post.nextAction.zid == changes["zone"].currentValue.zid) {
                        _this.currentAction = post.nextAction;
                        _this.lastOutcome = post.outcome;
                    }
                }
            });
        }
    };
    ZoneComponent.prototype.actionClick = function () {
        // TODO: Throttle these to thwart evil auto-clickers
        var skip = 500;
        var buffedSkip = skip * this.PS.player.meta.clickMultiplier;
        if (Math.random() < this.PS.player.meta.clickCritRate) {
            buffedSkip *= this.PS.player.meta.clickCritMultiplier;
            console.log("Critical click!");
        }
        if (buffedSkip != skip) {
            console.log("Click power buffed from " + skip + " to " + buffedSkip);
        }
        this.currentAction.advanceProgress(buffedSkip);
        this.Stats.clicked();
    };
    ZoneComponent.prototype.levelZone = function () {
        var level = this.zone.level + 1;
        index_1.levelUpZone(this.zone, level);
        this.Stats.leveledZone(this.zone.name, level);
        this.Stats.ziTokens -= 1;
        /** TODO: This is a huge hack. Just a quick and dirty way to
        get the corresponding zone-summary component to perform change
        detection. Come up with a less fragile approach when/if this
        zone leveling thing crystalizes. **/
        this.PS.player.skillChange$.next(0);
    };
    // Return a leveled version of current zone (as a preview - don't actually level it)
    ZoneComponent.prototype.leveledZone = function () {
        return index_1.leveledZone(this.zone, this.zone.level + 1);
    };
    ZoneComponent.prototype.delevelZone = function () {
        var level = this.zone.level - 1;
        index_1.levelUpZone(this.zone, level);
        this.Stats.leveledZone(this.zone.name, level);
        this.Stats.ziTokens += 1;
        /** TODO: This is a huge hack. Just a quick and dirty way to
        get the corresponding zone-summary component to perform change
        detection. Come up with a less fragile approach when/if this
        zone leveling thing crystalizes. **/
        this.PS.player.skillChange$.next(0);
    };
    ZoneComponent.prototype.select = function () {
        this.currentAction = this.AS.startActionLoop(this.zone);
    };
    ZoneComponent.prototype.stopAction = function () {
        this.AS.stopActionLoop(this.zone);
        this.currentAction = undefined;
        this.lastOutcome = undefined;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ZoneComponent.prototype, "zone", void 0);
    ZoneComponent = __decorate([
        core_1.Component({
            selector: 'zone',
            styles: [("\n        .progress-bar {\n            transition-duration: " + globals_1.GLOBALS.actionBarTransitionMs + "ms;\n            transition-timing-function: linear;\n        }\n        .progress-bar.reset {\n            transition: none;\n        }\n        .progress {\n            height: 40px;\n            width: 85%;\n        }\n        .ongoing-text {\n            font-weight: bold;\n            font-size: large;\n        }\n        .action-main {\n            min-height: 100px;\n        }\n        .previously {\n            margin-left: 25px;\n        }\n        .zone-header {\n            font-weight: bold;\n        }\n        ")],
            pipes: [skill_gains_pipe_1.SkillGainsPipe],
            template: "\n    <div class=\"row\">\n        <div class=\"col-xs-6\">\n            <h3>{{zone.name}}</h3>\n        </div>\n        <div class=\"col-xs-6\">\n            <spell-bar></spell-bar>\n        </div>\n    </div>\n\n    <div class=\"action-main\"\n    *ngIf=\"loaded\">\n        <div *ngIf=\"currentAction\">\n            <p class=\"ongoing-text text-center\">\n                {{currentAction.description}}...\n            </p>\n            <div class=\"progress center-block\" (click)=\"actionClick()\">\n                <div\n                    class=\"progress-bar {{currentAction.animationClass}}\"\n                    [style.width.%]=\"currentAction.pctProgress$ | async\"\n                    >\n                </div>\n            </div>\n\n            <div class=\"previously\" *ngIf=\"lastOutcome\">\n                <p class=\"mainOutcome\">{{lastOutcome.main.description}}\n                    <span *ngIf=\"lastOutcome.main.pointsGained\">\n                        ({{lastOutcome.main.pointsGained | skillgains}})\n                    </span>\n                </p>\n                <p *ngFor=\"let bonus of lastOutcome.secondary\" class=\"secondaryOutcome\">\n                    ... {{bonus.description}}\n                    <span *ngIf=\"bonus.pointsGained\">\n                        ({{bonus.pointsGained | skillgains}})\n                    </span>\n                </p>\n            </div>\n        </div>\n\n        <div *ngIf=\"!currentAction\">\n            {{zone.description}}\n\n            <div *ngIf=\"PS.canLevelZones() || cheatMode\"\n                class=\"row\">\n                <div class=\"col-xs-9\">\n                <div class=\"panel panel-info\">\n                <div class=\"panel-heading\">\n                <h3 class=\"panel-title\">\n                <a\n                    (click)=\"levelUpExpanded = !levelUpExpanded\"\n                >\n                Level up...\n                <span class=\"glyphicon glyphicon-chevron-down\"></span>\n                </a>\n                </h3>\n                </div>\n\n                <div *ngIf=\"levelUpExpanded\" class=\"panel-body\">\n                    <p>Leveling up will significantly increase the difficulty of this\n                    zone.</p>\n                    <p>Costs <b>1 Zone Improvement Token</b> (have: {{Stats.ziTokens}})\n                    </p>\n\n                    <!-- TODO: lots of copy-pasting going on here -->\n                    <ul class=\"list-group\">\n\n                    <li class=\"list-group-item zone-header\">\n                    <div class=\"row\">\n                        <div class=\"col-xs-2\">Zone</div>\n                        <div class=\"col-xs-1\">Level</div>\n                        <div class=\"col-xs-4\">Skills</div>\n                        <div class=\"col-xs-2\"\n                        title=\"If your skill levels are too low, actions will take longer\"\n                        >Slowdown</div>\n                    </div>\n                    </li>\n\n                    <li class=\"list-group-item\">\n                    <zone-summary [zone]=\"zone\" [live]=\"false\">\n                    </zone-summary>\n                    </li>\n\n                    <li class=\"list-group-item\">\n                    <div class=\"center-block\" [style.width]=\"50\">\n                        <h3><span class=\"glyphicon glyphicon-arrow-down\"></span></h3>\n                    </div>\n                    </li>\n\n                    <li class=\"list-group-item\">\n                    <zone-summary [zone]=\"leveledZone()\" [live]=\"false\">\n                    </zone-summary>\n                    </li>\n\n                    </ul>\n\n                    <button class=\"btn\"\n                    [class.disabled]=\"!canLevelZone() && !cheatMode\"\n                    (click)=\"levelZone()\">Level up</button>\n                    <button *ngIf=\"cheatMode\"\n                    class=\"btn\"\n                    (click)=\"delevelZone()\">Delevel</button>\n\n                </div>\n            </div></div></div>\n        </div>\n    </div>\n\n    <div class=\"action-options\">\n        <button (click)=\"select()\"\n            class=\"btn btn-primary\"\n            *ngIf=\"!currentAction\">Explore</button>\n        <button (click)=\"stopAction()\"\n            class=\"btn btn-danger\"\n            *ngIf=\"currentAction\">Stop</button>\n    </div>\n    "
        }), 
        __metadata('design:paramtypes', [action_service_1.ActionService, player_service_1.PlayerService, stats_service_1.StatsService])
    ], ZoneComponent);
    return ZoneComponent;
}());
exports.ZoneComponent = ZoneComponent;
//# sourceMappingURL=zone.component.js.map