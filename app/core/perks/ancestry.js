"use strict";
var globals_1 = require('../../globals');
// Return a multiplier in range [1,inf) (where 1 means no bonus)
function ancestryBonusForLevel(level) {
    var thresh = globals_1.GLOBALS.reincarnationMinLevel;
    if (level < thresh) {
        return 0;
    }
    // Your first level (i.e. level 10 currently) gets you a .5% bonus.
    // Level 13 => 2.5%, Level 18 => 5%,
    // Level 32 => 10%, Level 96 => 20%, 567=> 40%
    // Trying to hit a nice balance between rewarding exploration and concentration
    var loglvl = Math.log(level - (thresh - 2));
    return (loglvl * loglvl) / 50; // reduced from 100
}
exports.ancestryBonusForLevel = ancestryBonusForLevel;
// Return a multiplier in range [1,inf) (where 1 means no bonus)
function ancestryBonus(levels) {
    if (globals_1.GLOBALS.ancestryBonusGrowthRate == 'lin') {
        var multiplier = 0;
        for (var _i = 0, levels_1 = levels; _i < levels_1.length; _i++) {
            var klassLevel = levels_1[_i];
            multiplier += ancestryBonusForLevel(klassLevel);
        }
        return multiplier;
    }
    else if (globals_1.GLOBALS.ancestryBonusGrowthRate == 'exp') {
        var multiplier = 1;
        for (var _a = 0, levels_2 = levels; _a < levels_2.length; _a++) {
            var klassLevel = levels_2[_a];
            multiplier *= (1 +
                ancestryBonusForLevel(klassLevel));
        }
        return (multiplier - 1);
    }
    else {
        console.assert(false, "Unrecognized growth rate for ancestry bonus");
    }
}
exports.ancestryBonus = ancestryBonus;
//# sourceMappingURL=ancestry.js.map