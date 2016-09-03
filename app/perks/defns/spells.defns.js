"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var perk_1 = require('../perk');
var index_1 = require('../../core/index');
var di_tokens_1 = require('../../shared/di-tokens');
// Helpers to save some keystrokes
var ActionServiceSpell = (function (_super) {
    __extends(ActionServiceSpell, _super);
    function ActionServiceSpell() {
        _super.apply(this, arguments);
        this.diTokens = [di_tokens_1.di_tokens.actionservice];
    }
    return ActionServiceSpell;
}(perk_1.AbstractSpell));
var CurrentActionSpell = (function (_super) {
    __extends(CurrentActionSpell, _super);
    function CurrentActionSpell() {
        _super.apply(this, arguments);
        this.diTokens = [di_tokens_1.di_tokens.actionservice];
    }
    CurrentActionSpell.prototype.onCast = function (AS) {
        var action = AS.currentAction;
        if (!action || !action.active) {
            return false;
        }
        return this.actionEffect(action);
    };
    return CurrentActionSpell;
}(perk_1.AbstractSpell));
var SPELLS;
(function (SPELLS) {
    var AssassinPerk = (function (_super) {
        __extends(AssassinPerk, _super);
        function AssassinPerk() {
            _super.apply(this, arguments);
            this.cooldown = 60;
            this.completionThreshold = 50;
        }
        AssassinPerk.prototype.onCast = function (AS) {
            var action = AS.currentAction;
            if (!action || action.pctProgress < this.completionThreshold) {
                return false;
            }
            action.completeEarly();
            return true;
        };
        AssassinPerk.sname = "Execute";
        AssassinPerk.sdescription = "Instantly complete the current action if it's more than 50% complete.";
        return AssassinPerk;
    }(ActionServiceSpell));
    SPELLS.AssassinPerk = AssassinPerk;
    var ShamanPerk = (function (_super) {
        __extends(ShamanPerk, _super);
        function ShamanPerk() {
            _super.apply(this, arguments);
            this.cooldown = 60;
        }
        ShamanPerk.prototype.actionEffect = function (action) {
            action.spMultiplier += ShamanPerk.spMultiplier;
            return true;
        };
        ShamanPerk.sname = "Meditate";
        ShamanPerk.spMultiplier = 1.0;
        ShamanPerk.sdescription = "Increase the SP gained from the current action by 100%";
        return ShamanPerk;
    }(CurrentActionSpell));
    SPELLS.ShamanPerk = ShamanPerk;
    var BerserkerPerk = (function (_super) {
        __extends(BerserkerPerk, _super);
        function BerserkerPerk() {
            _super.apply(this, arguments);
            this.cooldown = 60;
            this.buffName = "GoingBerserk";
            this.buffDuration = 20;
        }
        BerserkerPerk.sname = "Berserk";
        BerserkerPerk.sdescription = "Go berserk, doubling action speed for a short time";
        return BerserkerPerk;
    }(perk_1.AbstractBuffingSpell));
    SPELLS.BerserkerPerk = BerserkerPerk;
    var ScholarPerk = (function (_super) {
        __extends(ScholarPerk, _super);
        function ScholarPerk() {
            _super.apply(this, arguments);
            this.cooldown = 300;
            this.diTokens = [di_tokens_1.di_tokens.playerservice];
        }
        ScholarPerk.prototype.onCast = function (PS) {
            var skill = index_1.randomSkill();
            var standard = index_1.XpFormulas.standardSpServingForSkillLevel(PS.player.skills[skill].baseLevel);
            /** Let's make it nice and swingy. Anywhere between 1 standard serving
            to 32 times **/
            var exponent = Math.random() * 5;
            var sp = Math.pow(2, exponent) * standard;
            console.log("Research spell training " + index_1.SkillType[skill] + " by " + sp + " points\n            standard=" + standard + ", exponent=" + exponent);
            PS.trainSkill(skill, sp);
            return true;
        };
        ScholarPerk.sname = "Research";
        ScholarPerk.sdescription = "Instantly gain a large number of skill points in a random skill";
        return ScholarPerk;
    }(perk_1.AbstractSpell));
    SPELLS.ScholarPerk = ScholarPerk;
})(SPELLS = exports.SPELLS || (exports.SPELLS = {}));
//# sourceMappingURL=spells.defns.js.map