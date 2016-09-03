"use strict";
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
var Subject_1 = require('rxjs/Subject');
var index_1 = require('../core/index');
var skill_1 = require('./skill');
var player_interface_1 = require('./player.interface');
var LivePlayer = (function () {
    function LivePlayer(name, 
        // Starts from 1 (unlike skills)
        level, klass, _skills) {
        this.name = name;
        this.level = level;
        this.klass = klass;
        this._skills = _skills;
        /** This is... confusing. It's essentially the number of skill levels
        left over after taking away those "used up" to reach the current plvl.
        It would be nice if this (and even plvl itself) could be recalculated
        when a player is deserialized, to gracefully handle any changes that
        might have occurred wrt level formulas.
        **/
        this._totalSkillLevels = this.calculateTotalSkills();
        // TODO: Possible to use only the subject, and not even need level ivar?
        this.level$ = new BehaviorSubject_1.BehaviorSubject(this.level);
        this.skillChange$ = new Subject_1.Subject();
        this.meta = new player_interface_1.PlayerMetadata();
    }
    LivePlayer.prototype.calculateTotalSkills = function () {
        var lvl = 1;
        var totalSkills = this._skills.reduce(function (acc, skill) { return acc + skill.level; }, 0);
        while (totalSkills >= LivePlayer.skillLevelsForNextLevel(lvl)) {
            totalSkills -= LivePlayer.skillLevelsForNextLevel(lvl);
            lvl++;
        }
        if (lvl != this.level) {
            console.warn("Calculated level " + lvl + ", but level " + this.level + " was\n                saved. Did you change the leveling formula?");
            this.level = lvl;
        }
        return totalSkills;
    };
    Object.defineProperty(LivePlayer.prototype, "skills", {
        get: function () {
            return this._skills;
        },
        enumerable: true,
        configurable: true
    });
    LivePlayer.newborn = function (name, klass, aptitudes) {
        return new LivePlayer(name, 1, klass, LivePlayer.newbornSkills(aptitudes));
    };
    LivePlayer.newbornSkills = function (aptitudes) {
        return index_1.skillMapFromFactory(function (s) {
            return new skill_1.LiveSkill(s, index_1.SkillType[s], aptitudes[s], 0);
        });
    };
    LivePlayer.fromJSON = function (raw) {
        return new LivePlayer(raw.name, raw.level, raw.klass, raw.skills.map(function (skill) { return skill_1.LiveSkill.fromJSON(skill); }));
    };
    LivePlayer.prototype.toJSON = function () {
        return {
            name: this.name,
            klass: this.klass,
            level: this.level,
            skills: this._skills.map(function (skill) { return skill.toJSON(); })
        };
    };
    Object.defineProperty(LivePlayer.prototype, "totalSkillLevels", {
        get: function () { return this._totalSkillLevels; },
        set: function (newValue) {
            if (newValue != this._totalSkillLevels) {
                this.skillChange$.next(0);
            }
            else {
                return;
            }
            var thresh = this.skillLevelsForNextLevel();
            while (newValue >= thresh) {
                this.level$.next(++this.level);
                newValue -= thresh;
                thresh = this.skillLevelsForNextLevel();
            }
            this._totalSkillLevels = newValue;
        },
        enumerable: true,
        configurable: true
    });
    LivePlayer.prototype.baseSkillLevels = function () {
        return this.skills.map(function (s) {
            return s.baseLevel;
        });
    };
    LivePlayer.prototype.progress = function () {
        return { numerator: this.totalSkillLevels,
            denominator: this.skillLevelsForNextLevel() };
    };
    LivePlayer.prototype.applySkillPoints = function (points) {
        var gains = index_1.zeroSkillMap();
        for (var _i = 0, _a = index_1.getTruthySkills(points); _i < _a.length; _i++) {
            var skill = _a[_i];
            var delta = this._skills[skill].train(points[skill]);
            gains[skill] = delta.pointsGained;
            this.totalSkillLevels += delta.levelsGained;
        }
        return gains;
    };
    LivePlayer.prototype.buffAptitudes = function (by) {
        for (var _i = 0, _a = index_1.getTruthySkills(by); _i < _a.length; _i++) {
            var skill = _a[_i];
            this._skills[skill].aptitudeBonus += by[skill];
        }
    };
    LivePlayer.prototype.buffSkillLevels = function (by) {
        this.skillChange$.next(0);
        for (var _i = 0, _a = index_1.getTruthySkills(by); _i < _a.length; _i++) {
            var skill = _a[_i];
            this._skills[skill].levelBonus += by[skill];
        }
    };
    LivePlayer.prototype.skillLevelsForNextLevel = function () {
        return LivePlayer.skillLevelsForNextLevel(this.level);
    };
    // How many skill levels needed to reach the level after the given one?
    LivePlayer.skillLevelsForNextLevel = function (level) {
        /** Experimenting with a few options here. SP/skill lvl already scales
        non-linearly, so maybe we don't need an additional form of scaling in
        skill-lvls/plvl. Using a constant makes reasoning about some other stuff
        easier.
        **/
        return 5;
        //return GLOBALS.playerLevelIncrement * level;
    };
    return LivePlayer;
}());
exports.LivePlayer = LivePlayer;
//# sourceMappingURL=player.js.map