"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var perk_1 = require('../perk');
var di_tokens_1 = require('../../shared/di-tokens');
var index_1 = require('../../core/index');
var BUFFS;
(function (BUFFS) {
    var GoingBerserk = (function (_super) {
        __extends(GoingBerserk, _super);
        function GoingBerserk() {
            _super.apply(this, arguments);
            this.diTokens = [di_tokens_1.di_tokens.actionservice];
            this.speedup = 1.0;
            this.duration = 20;
        }
        GoingBerserk.prototype.onCast = function (AS) {
            console.log("Applying berserking buff");
            AS.actionSpeedMultiplier += this.speedup;
        };
        GoingBerserk.prototype.cleanUp = function (AS) {
            console.log("Removing berserking buff");
            AS.actionSpeedMultiplier -= this.speedup;
        };
        GoingBerserk.sname = "Berserk";
        GoingBerserk.sdescription = "Action speed doubled";
        return GoingBerserk;
    }(perk_1.AbstractTimedBuff));
    BUFFS.GoingBerserk = GoingBerserk;
    var Fruity = (function (_super) {
        __extends(Fruity, _super);
        function Fruity(injector, buffedSkill) {
            _super.call(this, injector, buffedSkill);
            this.buffedSkill = buffedSkill;
            this.diTokens = [di_tokens_1.di_tokens.playerservice];
            this.duration = 120;
            this.buffAmt = 10;
        }
        Fruity.randomFruity = function (injector) {
            var randomSkill = Math.floor(Math.random() * index_1.SkillType.MAX);
            return new Fruity(injector, randomSkill);
        };
        Object.defineProperty(Fruity.prototype, "name", {
            get: function () {
                var g;
                switch (this.buffedSkill) {
                    case index_1.SkillType.Combat:
                        g = "wrath";
                        break;
                    case index_1.SkillType.Farming:
                        g = "agriculture";
                        break;
                    case index_1.SkillType.Survival:
                        g = "bushwack";
                        break;
                    case index_1.SkillType.Charm:
                        g = "yack";
                        break;
                    case index_1.SkillType.Stealth:
                        g = "stealth";
                        break;
                    case index_1.SkillType.Riding:
                        g = "yak";
                        break;
                    case index_1.SkillType.Intellect:
                        g = "math";
                        break;
                    case index_1.SkillType.Piety:
                        g = "the cloth";
                        break;
                    default:
                        g = "???";
                }
                return "Grapes of " + g;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Fruity.prototype, "description", {
            get: function () {
                return index_1.SkillType[this.buffedSkill] + (" boosted by " + this.buffAmt);
            },
            enumerable: true,
            configurable: true
        });
        Fruity.prototype.onCast = function (PS) {
            // It'd be kind of cool if these buff methods just returned a callback
            // that undid the buff. Could do the same thing e.g. with AS.actionSpeedMultiplier
            PS.buffSkillLevel(this.buffedSkill, this.buffAmt);
        };
        Fruity.prototype.cleanUp = function (PS) {
            PS.buffSkillLevel(this.buffedSkill, -this.buffAmt);
        };
        Fruity.sdescription = "Temporarily boost a skill";
        return Fruity;
    }(perk_1.AbstractTimedBuff));
    BUFFS.Fruity = Fruity;
})(BUFFS = exports.BUFFS || (exports.BUFFS = {}));
//# sourceMappingURL=buffs.defns.js.map