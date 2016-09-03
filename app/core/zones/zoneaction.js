"use strict";
var index_1 = require('../skills/index');
var utils_1 = require('../utils');
var globals_1 = require('../../globals');
var ACTION_METAVAR = "__X";
var VerbalZoneAction = (function () {
    function VerbalZoneAction(vb, obj, opts, skillDeltas, weight, minDelay, mastery, unlocks, oneshot) {
        this.vb = vb;
        this.obj = obj;
        this.opts = opts;
        this.skillDeltas = skillDeltas;
        this.weight = weight;
        this.minDelay = minDelay;
        this.mastery = mastery;
        this.unlocks = unlocks;
        this.oneshot = oneshot;
    }
    VerbalZoneAction.prototype.inexperiencePenaltyForSkill = function (skill, player) {
        var levelAssist = index_1.XpFormulas.levelAssist(player.level);
        var shortfall = Math.max(0, this.mastery -
            (player.skills[skill].level + levelAssist));
        return Math.pow(globals_1.GLOBALS.inexperiencePenaltyBase, shortfall) - 1;
    };
    VerbalZoneAction.prototype.slowdown = function (player) {
        var levelAssist = index_1.XpFormulas.levelAssist(player.level);
        var inexperiencePenalty = 1;
        for (var _i = 0, _a = index_1.getTruthySkills(this.skillDeltas); _i < _a.length; _i++) {
            var s = _a[_i];
            var shortfall = Math.max(0, this.mastery -
                (player.skills[s].level + levelAssist));
            inexperiencePenalty *= Math.pow(globals_1.GLOBALS.inexperiencePenaltyBase, shortfall);
        }
        return inexperiencePenalty - 1;
    };
    VerbalZoneAction.prototype.chooseDescription = function () {
        var predicate = this.descriptionPredicate();
        return {
            present: this.vb.pres + ' ' + predicate,
            past: this.vb.past + ' ' + predicate
        };
    };
    VerbalZoneAction.prototype.descriptionPredicate = function () {
        var pred = this.obj;
        if (pred.indexOf(ACTION_METAVAR) != -1) {
            var sub = utils_1.randomChoice(this.opts);
            pred = pred.replace(ACTION_METAVAR, sub);
        }
        return pred;
    };
    return VerbalZoneAction;
}());
exports.VerbalZoneAction = VerbalZoneAction;
//# sourceMappingURL=zoneaction.js.map