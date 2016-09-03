"use strict";
var zones_data_defns_1 = require('./zones.data.defns');
var zones_constants_1 = require('./zones.constants');
var globals_1 = require('../../globals');
var zone_interface_1 = require('./zone.interface');
var index_1 = require('../skills/index');
var zoneaction_1 = require('./zoneaction');
var verb_1 = require('./verb');
function levelUpZone(zone, toLevel) {
    var z;
    // Find the corresponding ZoneData template
    for (var _i = 0, SUPERZONEDATA_1 = zones_constants_1.SUPERZONEDATA; _i < SUPERZONEDATA_1.length; _i++) {
        var superz = SUPERZONEDATA_1[_i];
        for (var _a = 0, _b = superz.zones; _a < _b.length; _a++) {
            var zd = _b[_a];
            if (zd.name == zone.name) {
                z = zd;
                break;
            }
        }
        if (z) {
            break;
        }
    }
    console.assert(z != undefined);
    var newDiff = leveledZoneDifficulty(z, toLevel);
    console.assert(z.name == zone.name);
    for (var i = 0; i < z.actions.length; i++) {
        zone.actions[i] = zamFromJSON(z.actions[i], z, newDiff);
    }
    zone.difficulty = newDiff;
    zone.level = toLevel;
}
exports.levelUpZone = levelUpZone;
function leveledZone(zone, level) {
    var z;
    // Find the corresponding ZoneData template
    for (var _i = 0, SUPERZONEDATA_2 = zones_constants_1.SUPERZONEDATA; _i < SUPERZONEDATA_2.length; _i++) {
        var superz = SUPERZONEDATA_2[_i];
        for (var _a = 0, _b = superz.zones; _a < _b.length; _a++) {
            var zd = _b[_a];
            if (zd.name == zone.name) {
                z = zd;
                break;
            }
        }
        if (z) {
            break;
        }
    }
    console.assert(z != undefined);
    return zoneFromJSON(z, -1, "idklol", level);
}
exports.leveledZone = leveledZone;
function leveledZoneDifficulty(zone, level) {
    return zone.difficulty + (level * globals_1.GLOBALS.difficultyBonusPerZoneLevel);
}
function loadSuperZones(zoneLevels) {
    var superzones = [];
    var id = 0;
    var _loop_1 = function(superzone) {
        if (superzone.cheat && !globals_1.GLOBALS.cheatMode) {
            return "continue";
        }
        var zones = new Array();
        for (var _i = 0, _a = superzone.zones; _i < _a.length; _i++) {
            var zoneData = _a[_i];
            var z = zoneFromJSON(zoneData, id++, superzone.name, zoneLevels[zoneData.name] || 0);
            zones.push(z);
        }
        var supz = {
            name: superzone.name,
            zones: zones,
            unlockDescription: "Unlocked at level " + superzone.minLevel,
            unlockCondition: function (level) { return level >= superzone.minLevel; }
        };
        superzones.push(supz);
    };
    for (var _b = 0, SUPERZONEDATA_3 = zones_constants_1.SUPERZONEDATA; _b < SUPERZONEDATA_3.length; _b++) {
        var superzone = SUPERZONEDATA_3[_b];
        var state_1 = _loop_1(superzone);
        if (state_1 === "continue") continue;
    }
    return superzones;
}
exports.loadSuperZones = loadSuperZones;
function setProbabilities(actions) {
    var freeWeight = 0;
    var reservedWeight = 0;
    for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
        var a = actions_1[_i];
        if (a.prob) {
            reservedWeight += a.prob;
        }
        else if (a.weight) {
            freeWeight += a.weight;
        }
        else {
            if (a.bonusLevel) {
                a.weight = Math.pow(10, -a.bonusLevel);
            }
            else {
                a.weight = 1.0;
            }
            freeWeight += a.weight;
        }
    }
    console.assert(reservedWeight <= 1);
    // How much to scale free weights by
    var scaleFactor = (1 - reservedWeight) / freeWeight;
    for (var _a = 0, actions_2 = actions; _a < actions_2.length; _a++) {
        var action = actions_2[_a];
        if (!action.prob) {
            action.prob = action.weight * scaleFactor;
        }
    }
}
function zoneFromJSON(j, id, superzone, level) {
    // Is this giving up type safety?
    var z = new zone_interface_1.ConcreteZone();
    z.superzone = superzone;
    z.zid = id;
    z.name = j.name;
    z.description = j.description;
    z.difficulty = leveledZoneDifficulty(j, level);
    z.level = level;
    z.actions = new Array();
    console.assert(j.actions.length > 0);
    /** Postcondition: each action in j.actions will have a prob member, and
        they'll sum to 1 **/
    setProbabilities(j.actions);
    for (var _i = 0, _a = j.actions; _i < _a.length; _i++) {
        var a = _a[_i];
        var zam = zamFromJSON(a, j, leveledZoneDifficulty(j, level));
        z.actions.push(zam);
    }
    return z;
}
/** TODO: surrogateDifficulty thing is a dumb bandaid hack. Need to refactor this.
**/
function zamFromJSON(j, parentZone, surrogateDifficulty) {
    var skills = j.skills instanceof Array ? j.skills : [j.skills];
    var delay = parentZone.baseDelay ? parentZone.baseDelay : globals_1.GLOBALS.defaultBaseZoneDelay;
    // skill ratios
    var skillRatios = j.skillRatios;
    // If none is explicitly provided, default to equal apportionment
    if (!skillRatios) {
        skillRatios = {};
        for (var _i = 0, skills_1 = skills; _i < skills_1.length; _i++) {
            var skill = skills_1[_i];
            skillRatios[index_1.SkillType[skill]] = 1 / skills.length;
        }
    }
    // The difficulty of this action will determine default values for mastery and skill points
    var difficulty = surrogateDifficulty ? surrogateDifficulty : parentZone.difficulty;
    if (j.difficulty) {
        difficulty = j.difficulty(difficulty);
    }
    if (j.bonusLevel) {
        /** Still experimenting with this. Possible the difflvl per bonusLevel
        should increase with overall zone difficulty? These still don't really
        feel "epic" enough. Maybe diff should even scale exponentially with
        bonusLevel, the way rarity and skill gains do. Let's try it.
        Given that skill gains scale with 10^bonus, it should still pretty
        much always be worth it to do these. Probably.
        **/
        difficulty = difficulty + Math.ceil(Math.pow(2, j.bonusLevel));
    }
    /** XXX: I feel like I've consistently set difficulties a bit too low, so just
    going to play with a tweak here and see how it feels.
    **/
    difficulty += 0;
    // mastery
    var mastery = masteryForDifficulty(difficulty);
    if (j.mastery) {
        mastery = j.mastery(mastery);
    }
    // skill deltas
    var skillGains = gainsForDifficulty(difficulty, skills, skillRatios);
    if (j.bonusLevel && !j.gains) {
        j.gains = zones_data_defns_1.multiplicativeOverride(Math.pow(10, j.bonusLevel));
    }
    if (j.gains) {
        for (var skill in skillGains) {
            skillGains[skill] = j.gains(skillGains[skill]);
        }
    }
    return new zoneaction_1.VerbalZoneAction(verb_1.verbLookup(j.vb), j.obj, j.opts, index_1.dictToSkillMap(skillGains), j.prob, delay, mastery, j.unlocks, j.oneShot);
}
function masteryForDifficulty(diff) {
    // (maybe rounding should happen upstream?)
    return Math.ceil(index_1.XpFormulas.benchmarkSkillLevelForPlevel(diff)
        + index_1.XpFormulas.levelAssist(diff));
}
function gainsForDifficulty(diff, skills, skillRatios) {
    // The more skills an action involves, the more total skill points it should
    // award (for a given difficulty). But the skill points awarded per skill should
    // decrease monotonically as #skills increases.
    //
    // For now, let's say that the total skill gain is multiplied by .5 + (.5 * #skills)
    var baseSP = index_1.XpFormulas.standardSpServing(diff);
    var totalSP = baseSP * (.5 + .5 * (skills.length));
    var gains = {};
    for (var skillName in skillRatios) {
        gains[skillName] = totalSP * skillRatios[skillName];
    }
    return gains;
}
//# sourceMappingURL=zones.data.js.map