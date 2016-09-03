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
var action_service_1 = require('../actions/action.service');
var perk_service_1 = require('../perks/perk.service');
var player_service_1 = require('../player/player.service');
var klass_service_1 = require('./klass.service');
var stats_service_1 = require('../stats/stats.service');
var zones_service_1 = require('../zones/zones.service');
var skill_component_1 = require('../shared/skill.component');
var multiplier_pipe_1 = require('../shared/multiplier.pipe');
var index_1 = require('../core/index');
var globals_1 = require('../globals');
var KlassesComponent = (function () {
    function KlassesComponent(KS, PS, AS, Perks, Stats, ZS, router) {
        this.KS = KS;
        this.PS = PS;
        this.AS = AS;
        this.Perks = Perks;
        this.Stats = Stats;
        this.ZS = ZS;
        this.router = router;
        /** TODO: This should probably be sticky. **/
        this.showMaxLevelsInline = false;
        this.reincarnating = false;
        this.reincMinLevel = globals_1.GLOBALS.reincarnationMinLevel;
        this.ST = index_1.SkillType;
        this.cheatMode = globals_1.GLOBALS.cheatMode;
    }
    KlassesComponent.prototype.sumapts = function (apts) {
        return apts.reduce(function (acc, val) { return acc + val; }, 0);
    };
    KlassesComponent.prototype.displayName = function (klass) {
        if (!klass.unlocked) {
            return '???';
        }
        var name = klass.name;
        if (this.showMaxLevelsInline) {
            name += " (" + this.Stats.playerLevel(klass.name) + ")";
        }
        return name;
    };
    // Bleh, hack
    KlassesComponent.prototype.aptitudePairs = function (klass) {
        var pairs = [];
        for (var i = 0; i < index_1.SkillType.MAX; i += 2) {
            var pair = [
                { i: i, apt: klass.aptitudes[i] },
                { i: i + 1, apt: klass.aptitudes[i + 1] },
            ];
            pairs.push(pair);
        }
        return pairs;
    };
    KlassesComponent.prototype.aptTitle = function (apt) {
        return "Base " + index_1.SkillType[apt.i] + " aptitude: " + apt.apt;
    };
    KlassesComponent.prototype.aptStyle = function (apt) {
        if (apt < .5) {
            return 'danger';
        }
        else if (apt <= 1.0) {
            return 'warning';
        }
        else {
            return 'success';
        }
    };
    KlassesComponent.prototype.reincarnate = function () {
        /** Reincarnation todo list:
        - stop any currently running actions
        - clear inventory
        - remove all buffs and perks
        - create a new player object and assign the appropriate perks (taken
            care of by player service)
        */
        // TODO: Should also reset the focal zone (incl. clearing currentAction/lastOutcome)
        this.AS.stopAllActions();
        /** TODO: This is kind of lame. Should try to find a more appropriate
        place for this logic at some point. **/
        if ((!this.Stats.unlocked(index_1.NamedUnlock.Pacifist)) &&
            (this.PS.player.level >= 10) &&
            (this.PS.player.skills[index_1.SkillType.Combat].baseLevel < 1)) {
            this.Stats.unlock(index_1.NamedUnlock.Pacifist);
        }
        this.Stats.setLevel(this.PS.player.level, this.PS.player.klass);
        this.Stats.reincarnated();
        this.ZS.reloadZones();
        this.ZS.resetFocalZone();
        this.Perks.onReincarnate();
        this.PS.reincarnate(this.KS.focalKlass.name);
        this.Perks.postReincarnate();
        this.router.navigate(['/']);
    };
    KlassesComponent = __decorate([
        core_1.Component({
            selector: 'klass-viewer',
            directives: [skill_component_1.SkillComponent],
            pipes: [multiplier_pipe_1.MultiplierPipe],
            styles: [
                ".big-icon {\n            /*width: 216px;*/\n            width: 180px;\n        }\n        img.locked {\n            -webkit-filter: contrast(0);\n            filter: contrast(0);\n        }\n        ul {\n            list-style: none;\n        }\n        .reincarnate-button {\n            margin-top: 20px;\n            margin-bottom: 20px;\n        }\n        .glyphicon-arrow-right {\n            margin-top: 100%;\n        }\n        .progress {\n            /* Match the size of skill icons */\n            height: 32px;\n            /* Rounded corners create weird lacunae when the bars are packed together */\n            border-radius: 0px;\n        }\n        .apt-row {\n            margin-top: 0px;\n            margin-bottom: 0px;\n            height: 32px;\n            padding-top: 0px;\n            padding-bottom: 0px;\n        }\n        .apt-row div {\n            max-height: 32px;\n        }\n        .stats-panel {\n            margin-top: 15px;\n        }\n        "
            ],
            /** TODO: This template is huuuge. Split into subcomponents and/or move
            to a separate file.
            **/
            /** Modal code taken from this SO answer: http://stackoverflow.com/a/37402577/262271
            TODO: Definitely consider component-izing at some point. Probably useful elsewhere.
            https://toddmotto.com/transclusion-in-angular-2-with-ng-content
            **/
            template: "\n<div *ngIf=\"reincarnating\" class=\"modal fade show in danger\" role=\"dialog\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n            <div class=\"modal-header\">\n                <button type=\"button\" class=\"close\"\n                    (click)=\"reincarnating=false\">&times;\n                </button>\n                <h4 class=\"modal-title\">Reincarnate?</h4>\n            </div>\n            <div class=\"modal-body\">\n\n            <div class=\"row\">\n                <div class=\"col-xs-5\">\n                    <img class=\"big-icon\"\n                        [src]=\"KS.iconForKlass(PS.player.klass)\">\n                </div>\n                <div class=\"col-xs-2\">\n                    <h2><span class=\"glyphicon glyphicon-arrow-right\"></span></h2>\n                </div>\n                <div class=\"col-xs-5\">\n                    <img class=\"big-icon\"\n                        [src]=\"KS.iconForKlass(KS.focalKlass.name)\">\n                </div>\n            </div>\n\n            <dl>\n                <dt>Level</dt>\n                <dd>{{PS.player.level}}</dd>\n\n                <dt>Previous best</dt>\n                <dd>{{Stats.playerLevel(PS.player.klass)}}</dd>\n\n                <template [ngIf]=\"PS.player.level > Stats.playerLevel(PS.player.klass)\">\n                <dt>{{PS.player.klass}} ancestry bonus</dt>\n                <dd>{{Perks.ancestryBonusForLevel(PS.player.level) | multiplier}}\n                (previously:\n                    {{Perks.ancestryBonusForLevel(Stats.playerLevel(PS.player.klass)) | multiplier}})\n                </dd>\n                <dt>Overall ancestry bonus</dt>\n                <dd>\n                {{Perks.ancestryBonusWithSub(Stats, PS.player.klass, PS.player.level) | multiplier}}\n                (previously: {{Perks.ancestryBonus(Stats) | multiplier}})\n                </template>\n            </dl>\n\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-default\" (click)=\"reincarnate()\">\n                    Reincarnate\n                </button>\n                <button type=\"button\"\n                    class=\"btn btn-default\"\n                    (click)=\"reincarnating=false\">Never mind\n                </button>\n            </div>\n        </div>\n    </div>\n</div>\n\n<div class=\"row\">\n\n<div class=\"col-xs-4\">\n<div *ngIf=\"KS.focalKlass\" class=\"focal\">\n    <h2>{{displayName(KS.focalKlass)}}</h2>\n    <img [src]=\"'assets/units/' + KS.focalKlass.img\"\n        class=\"big-icon\"\n        [class.locked]=\"!KS.focalKlass.unlocked\">\n\n    <h3><span class=\"label label-default\">Aptitudes</span></h3>\n    <div class=\"apts\">\n        <div class=\"row apt-row\"\n            *ngFor=\"let pair of aptitudePairs(KS.focalKlass)\">\n            <template ngFor let-apt [ngForOf]=\"pair\">\n                <div class=\"col-xs-1\">\n                    <skill [skill]=\"apt.i\" [title]=\"ST[apt.i]\"></skill>\n                </div>\n                <div class=\"col-xs-5\">\n                    <div class=\"progress\"\n                        [title]=\"aptTitle(apt)\"\n                    >\n                        <div class=\"progress-bar progress-bar-{{aptStyle(apt.apt)}}\"\n                        [style.width.%]=\"100*apt.apt/2.0\"\n                        ></div>\n                    </div>\n                </div>\n\n            </template>\n        </div>\n        <p *ngIf=\"cheatMode\">DEBUG: Sum of apts={{sumapts(KS.focalKlass.aptitudes) | number:'1.1-1'}}</p>\n    </div>\n\n    <div *ngIf=\"KS.focalKlass.unlocked\">\n    <p><b>{{Perks.perkForKlass(KS.focalKlass.name).sname}}</b>\n        {{Perks.perkForKlass(KS.focalKlass.name).sdescription}}\n    </p>\n    <p><b>Max level reached:</b>{{Stats.playerLevel(KS.focalKlass.name)}}</p>\n    </div>\n\n    <button *ngIf=\"(KS.focalKlass.unlocked)\n                    || cheatMode\"\n        class=\"btn btn-default reincarnate-button center-block\"\n        [class.disabled]=\"!cheatMode && PS.player.level < 10\"\n        (click)=\"reincarnating=true\">\n            Reincarnate!\n    </button>\n    <div *ngIf=\"!KS.focalKlass.unlocked\">\n        <p *ngIf=\"KS.focalKlass.progress != undefined\">\n            Unlock progress: {{KS.focalKlass.progress | percent:'1.0-0'}}\n        </p>\n        <p><b>Hint:</b> {{KS.focalKlass.hint}}</p>\n\n    </div>\n</div>\n</div>\n\n<div class=\"col-xs-8\">\n    <div class=\"row\">\n        <div *ngFor=\"let klass of KS.allKlasses\"\n            class=\"col-xs-2\"\n        >\n            <img [src]=\"'assets/units/' + klass.img\"\n                [class.locked]=\"!klass.unlocked\"\n                (click)=\"KS.focalKlass=klass\"\n                >\n            <div>\n            <a (click)=\"KS.focalKlass=klass\">{{displayName(klass)}}</a>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"panel panel-default stats-panel\">\n    <div class=\"panel-body\">\n    <div class=\"row\">\n    <div class=\"col-xs-3 col-xs-offset-3\">\n        <p>{{KS.nUnlocked}} / {{KS.nKlasses}} classes unlocked</p>\n    </div>\n    <div class=\"col-xs-3\">\n        <input type=\"checkbox\" [(ngModel)]=\"showMaxLevelsInline\">\n        <span>Show max levels</span>\n    </div>\n    </div></div></div>\n</div>\n\n</div>\n    "
        }), 
        __metadata('design:paramtypes', [klass_service_1.KlassService, player_service_1.PlayerService, action_service_1.ActionService, perk_service_1.PerkService, stats_service_1.StatsService, zones_service_1.Zones, router_1.Router])
    ], KlassesComponent);
    return KlassesComponent;
}());
exports.KlassesComponent = KlassesComponent;
//# sourceMappingURL=klasses.component.js.map