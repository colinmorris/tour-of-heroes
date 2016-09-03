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
var progressbar_component_1 = require('../shared/progressbar.component');
var perks_component_1 = require('../perks/perks.component');
var buffed_stat_component_1 = require('./buffed-stat.component');
var skill_component_1 = require('../shared/skill.component');
var klass_service_1 = require('../klasses/klass.service');
var player_service_1 = require('./player.service');
var PlayerComponent = (function () {
    function PlayerComponent(PS, KS) {
        this.PS = PS;
        this.KS = KS;
        this.character = PS.player;
    }
    PlayerComponent = __decorate([
        core_1.Component({
            selector: 'player-pane',
            directives: [progressbar_component_1.ProgressBarComponent, perks_component_1.PerksComponent,
                buffed_stat_component_1.BuffedStatComponent, skill_component_1.SkillComponent],
            styles: [
                "\n        .skillbars progress-bar >>> div {\n            margin-bottom: 0;\n        }\n        .list-group-item {\n            padding-top: 5px;\n            padding-bottom: 5px;\n        }\n        .char-icon {\n            width: 100%;\n        }\n        .lvl {\n            font-weight: bold;\n        }\n        .charcol {\n            display: inline-block;\n            vertical-align: middle;\n            float: none;\n        }\n        .chartext p {\n            line-height: 1.2;\n        }\n        "
            ],
            template: "\n    <div class=\"row\">\n        <div class=\"col-xs-6 charcol\">\n        <img class=\"char-icon\"\n             [src]=\"KS.iconForKlass(character.klass)\"\n             [title]=\"character.klass\"\n        >\n        </div><div class=\"col-xs-6 charcol chartext\">\n        <h4>\n        <p class=\"text-left\">Level\n        <span class=\"lvl\">{{character.level}}</span>\n        {{character.klass}}</p>\n        </h4>\n        </div>\n\n    </div>\n    <div class=\"row\">\n    <div class=\"col-xs-8 col-xs-offset-2\">\n    <progress-bar [prog]=\"character\"></progress-bar>\n    </div>\n    </div>\n\n    <div class=\"skillbars\">\n        <ul class=\"list-group\">\n\n            <li class=\"list-group-item\">\n            <div class=\"row\">\n                <div class=\"col-xs-4 col-xs-offset-2\">\n                    <b\n    title=\"Skill level. Raise these to take on more difficulty zones and raise your player level.\">\n                    Level</b>\n                </div>\n\n                <div class=\"col-xs-4 col-xs-offset-2\">\n                    <b title=\"Skill gains are multiplied by this\"\n                    >Aptitude</b>\n                </div>\n            </div>\n            </li>\n\n        <li *ngFor=\"let skill of character.skills\" class=\"list-group-item\">\n        <div class=\"row\">\n\n            <div class=\"col-xs-2\">\n            <skill [skill]=\"skill.id\" [title]=\"skill.name\"></skill>\n            </div>\n\n            <div class=\"col-xs-2\">\n            <buffed-stat [base]=\"skill.baseLevel\" [buffed]=\"skill.level\" [toast]=\"true\">\n            </buffed-stat>\n            </div>\n\n            <div class=\"col-xs-6\">\n            <progress-bar [prog]=\"skill\"></progress-bar>\n            </div>\n\n            <div class=\"col-xs-2\">\n            <buffed-stat [base]=\"skill.baseAptitude\"\n                [buffed]=\"skill.aptitude\"></buffed-stat>\n            </div>\n        </div>\n        </li>\n        </ul>\n    </div>\n\n    <perks></perks>\n\n    <inventory></inventory>\n    "
        }), 
        __metadata('design:paramtypes', [player_service_1.PlayerService, klass_service_1.KlassService])
    ], PlayerComponent);
    return PlayerComponent;
}());
exports.PlayerComponent = PlayerComponent;
//# sourceMappingURL=player.component.js.map