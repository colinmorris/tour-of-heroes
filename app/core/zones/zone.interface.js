"use strict";
var index_1 = require('../skills/index');
// TODO: move to separate file
var ConcreteZone = (function () {
    function ConcreteZone() {
        this.level = 0;
    }
    ConcreteZone.prototype.difficultyPerSkill = function (player) {
        /** First figure out how significant each skill is, given the probability
        weights on each action.
        **/
        var skillWeights = index_1.uniformSkillMap(0);
        var totalSkillWeight = 0;
        for (var _i = 0, _a = this.actions; _i < _a.length; _i++) {
            var action = _a[_i];
            for (var _b = 0, _c = index_1.getTruthySkills(action.skillDeltas); _b < _c.length; _b++) {
                var skill = _c[_b];
                skillWeights[skill] += action.weight;
                totalSkillWeight += action.weight;
            }
        }
        /** difficulties[s] := expected slowdown imposed by s, calculated over
                                all actions in this zone involving s
        **/
        var difficulties = index_1.uniformSkillMap(0);
        /** mastery[s] := s must be this level for this skill to impose no slowdown
                          for any action in this zone (fn of current plevel!)
        **/
        var masteryLevels = index_1.uniformSkillMap(0);
        var overallExpectedPenalty = 0;
        var levelAssist = index_1.XpFormulas.levelAssist(player.level);
        for (var _d = 0, _e = this.actions; _d < _e.length; _d++) {
            var action = _e[_d];
            var actionPenalty = action.slowdown(player);
            overallExpectedPenalty += action.weight * actionPenalty;
            for (var _f = 0, _g = index_1.getTruthySkills(action.skillDeltas); _f < _g.length; _f++) {
                var skill = _g[_f];
                // How frequent is this action, relative to all actions involving this skill
                var relativeWeight = action.weight / skillWeights[skill];
                difficulties[skill] += relativeWeight *
                    action.inexperiencePenaltyForSkill(skill, player);
                /** Mastery is compared to skill level plus levelAssist. Let's
                isolate the skill level portion. **/
                var skillRequired = action.mastery - levelAssist;
                masteryLevels[skill] = Math.max(masteryLevels[skill], skillRequired);
            }
        }
        var diffObjs = new Array();
        for (var s = 0; s < index_1.SkillType.MAX; s++) {
            if (skillWeights[s] == 0) {
                diffObjs.push(undefined);
            }
            else {
                var diff = { penalty: difficulties[s],
                    masteredAt: masteryLevels[s] };
                diffObjs.push(diff);
            }
        }
        return { score: overallExpectedPenalty, perSkill: diffObjs };
    };
    ConcreteZone.prototype.chooseAction = function () {
        var dice = Math.random();
        var sofar = 0;
        for (var _i = 0, _a = this.actions; _i < _a.length; _i++) {
            var action = _a[_i];
            sofar += action.weight;
            if (sofar > dice) {
                return action;
            }
        }
        console.assert(false, "Shouldnt have reached here.");
    };
    return ConcreteZone;
}());
exports.ConcreteZone = ConcreteZone;
//# sourceMappingURL=zone.interface.js.map