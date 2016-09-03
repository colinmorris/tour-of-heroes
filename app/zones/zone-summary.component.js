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
var index_1 = require('../core/index');
var player_service_1 = require('../player/player.service');
var zones_service_1 = require('./zones.service');
var skill_component_1 = require('../shared/skill.component');
var ZoneSummaryComponent = (function () {
    function ZoneSummaryComponent(router, zones, PS, cd) {
        this.router = router;
        this.zones = zones;
        this.PS = PS;
        this.cd = cd;
        this.ST = index_1.SkillType;
        this.youAreHere = false;
        /** If we're not live, this becomes non-interactive (i.e. no button to
        navigate to the zone). Used in previews.
        **/
        this.live = true;
    }
    ZoneSummaryComponent.prototype.ngOnInit = function () {
        var _this = this;
        /** If we wanted to be really fancy, we could check once which skills
        this zone involves, and only listen for changes to those skills. But
        let's not go nuts.
        **/
        console.assert(this.skillsub == undefined || this.skillsub.isUnsubscribed);
        this.skillsub = this.PS.player.skillChange$.subscribe(function () {
            _this.update();
        });
        this.zd = this.zone.difficultyPerSkill(this.PS.player);
    };
    ZoneSummaryComponent.prototype.ngOnDestroy = function () {
        if (this.skillsub) {
            this.skillsub.unsubscribe();
        }
    };
    ZoneSummaryComponent.prototype.ngOnChanges = function () {
        /** Need this for use of this component in the "level up" preview view,
        where the zone may change in place. **/
        this.zd = this.zone.difficultyPerSkill(this.PS.player);
    };
    ZoneSummaryComponent.prototype.update = function () {
        this.zd = this.zone.difficultyPerSkill(this.PS.player);
        this.cd.markForCheck();
    };
    ZoneSummaryComponent.prototype.buttonText = function () {
        return this.locked ? "Locked" : "Go";
    };
    ZoneSummaryComponent.prototype.nameString = function (zone) {
        return zone.name;
    };
    ZoneSummaryComponent.prototype.explore = function () {
        this.zones.focalZone = this.zone;
    };
    ZoneSummaryComponent.prototype.difficultyColor = function (diff) {
        if (diff <= 0.005) {
            return 'lightgreen';
        }
        else if (diff <= .5) {
            return 'yellow';
        }
        else if (diff <= 2) {
            return 'orange';
        }
        else {
            return 'maroon';
        }
    };
    ZoneSummaryComponent.prototype.difficultyString = function (d) {
        var diffWordFn = function (diff) {
            if (diff <= 0.005) {
                return 'easy';
            }
            else if (diff <= .5) {
                return 'challenging';
            }
            else if (diff <= 2) {
                return 'hard';
            }
            else {
                return 'grueling';
            }
        };
        var currSkill = this.PS.getSkillLevel(d.skill);
        return diffWordFn(d.difficulty) + ":\n            penalty=" + this.penaltyString(d.difficulty) + "\n             mastered at level " + Math.ceil(d.masteredAt) + " (currently: " + currSkill + ")";
    };
    ZoneSummaryComponent.prototype.penaltyString = function (penalty) {
        var pct = (penalty * 100).toFixed(0);
        return pct == "0" ? "" : pct + '%';
    };
    ZoneSummaryComponent.prototype.overallDifficulty = function () {
        return this.zd.score;
    };
    ZoneSummaryComponent.prototype.difficulties = function () {
        var diffs = [];
        var diffLvls = this.zd.perSkill;
        for (var _i = 0, _a = index_1.getTruthySkills(diffLvls); _i < _a.length; _i++) {
            var skill = _a[_i];
            diffs.push({
                skill: skill,
                difficulty: diffLvls[skill].penalty,
                masteredAt: diffLvls[skill].masteredAt
            });
        }
        return diffs;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ZoneSummaryComponent.prototype, "youAreHere", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ZoneSummaryComponent.prototype, "live", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ZoneSummaryComponent.prototype, "zone", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ZoneSummaryComponent.prototype, "locked", void 0);
    ZoneSummaryComponent = __decorate([
        core_1.Component({
            selector: 'zone-summary',
            directives: [router_1.ROUTER_DIRECTIVES, skill_component_1.SkillComponent],
            styles: ["\n        "],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            template: "\n    <div class=\"row\">\n\n    <div class=\"col-xs-2\">\n    <span title=\"DEBUG: difficulty={{zone.difficulty}}\">{{nameString(zone)}}</span>\n    </div>\n\n    <div class=\"col-xs-1\">\n        {{zone.difficulty}}\n    </div>\n\n    <div class=\"col-xs-4\">\n    <span *ngFor=\"let diff of difficulties()\">\n        <skill [skill]=\"diff.skill\"\n            [bg]=\"difficultyColor(diff.difficulty)\"\n            [title]=\"difficultyString(diff)\"\n            >\n        </skill>\n    </span>\n    </div>\n\n    <div class=\"col-xs-2\">\n    <span class=\"overall-difficulty\"\n    >\n          {{penaltyString(overallDifficulty())}}\n    </span>\n    </div>\n\n    <div class=\"col-xs-3\" *ngIf=\"live\">\n    <button *ngIf=\"!youAreHere\"\n        class=\"btn\"\n        [class.disabled]=\"locked\"\n        (click)=\"explore()\">\n        {{buttonText()}}</button>\n    <h4 *ngIf=\"youAreHere\">\n        <span class=\"label label-success\">\n        You are here\n        </span>\n    </h4>\n    </div>\n\n    </div>\n    "
        }), 
        __metadata('design:paramtypes', [router_1.Router, zones_service_1.Zones, player_service_1.PlayerService, core_1.ChangeDetectorRef])
    ], ZoneSummaryComponent);
    return ZoneSummaryComponent;
}());
exports.ZoneSummaryComponent = ZoneSummaryComponent;
//# sourceMappingURL=zone-summary.component.js.map