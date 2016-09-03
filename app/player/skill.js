"use strict";
var index_1 = require('../core/index');
var LiveSkill = (function () {
    function LiveSkill(id, name, baseAptitude, points) {
        this.id = id;
        this.name = name;
        this.baseAptitude = baseAptitude;
        this.points = points;
        this.aptitudeBonus = 0;
        this.levelBonus = 0;
        this.crunchStartingPoints();
    }
    LiveSkill.prototype.crunchStartingPoints = function () {
        var usedPoints = 0;
        var floatingPoints = this.points;
        var lvl = 0;
        var nextLump = index_1.XpFormulas.skillPointsToAdvanceLevel(lvl);
        while (nextLump <= floatingPoints) {
            floatingPoints -= nextLump;
            usedPoints += nextLump;
            lvl++;
            nextLump = index_1.XpFormulas.skillPointsToAdvanceLevel(lvl);
        }
        this.baseLevel = lvl;
        this.floatingPoints = floatingPoints;
    };
    LiveSkill.prototype.toJSON = function () {
        return {
            id: this.id,
            name: this.name,
            baseAptitude: this.baseAptitude,
            points: this.points
        };
    };
    LiveSkill.fromJSON = function (raw) {
        return new LiveSkill(raw.id, raw.name, raw.baseAptitude, raw.points);
    };
    Object.defineProperty(LiveSkill.prototype, "level", {
        get: function () {
            return this.baseLevel + this.levelBonus;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LiveSkill.prototype, "aptitude", {
        get: function () {
            return this.baseAptitude + this.aptitudeBonus;
        },
        enumerable: true,
        configurable: true
    });
    LiveSkill.prototype.progress = function () {
        return { numerator: this.floatingPoints, denominator: this.pointsForNextLevel };
    };
    LiveSkill.prototype.train = function (points) {
        var pointGain = points * this.aptitude;
        this.points += pointGain;
        var newFloat = this.floatingPoints + pointGain;
        var thresh = this.pointsForNextLevel;
        var levelDelta = 0;
        while (newFloat >= thresh) {
            this.baseLevel++;
            levelDelta++;
            newFloat -= thresh;
            thresh = this.pointsForNextLevel;
        }
        this.floatingPoints = newFloat;
        return { pointsGained: pointGain, levelsGained: levelDelta };
    };
    Object.defineProperty(LiveSkill.prototype, "pointsForNextLevel", {
        get: function () {
            return index_1.XpFormulas.skillPointsToAdvanceLevel(this.baseLevel);
        },
        enumerable: true,
        configurable: true
    });
    return LiveSkill;
}());
exports.LiveSkill = LiveSkill;
//# sourceMappingURL=skill.js.map