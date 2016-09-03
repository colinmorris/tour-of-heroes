"use strict";
var index_1 = require('../core/index');
/** Data only descriptive of the current lifetime. Reset to a blank slate
    on reincarnation. **/
var CurrentLifetimeData = (function () {
    function CurrentLifetimeData(
        // Indexed by OneShotAction
        oneShots, skillLevels, ziTokens, zoneLevels) {
        if (oneShots === void 0) { oneShots = []; }
        if (skillLevels === void 0) { skillLevels = index_1.zeroSkillMap(); }
        if (ziTokens === void 0) { ziTokens = 0; }
        if (zoneLevels === void 0) { zoneLevels = {}; }
        this.oneShots = oneShots;
        this.skillLevels = skillLevels;
        this.ziTokens = ziTokens;
        this.zoneLevels = zoneLevels;
        for (var s = 0; s < index_1.OneShotAction.MAX; s++) {
            this.oneShots[s] = false;
        }
    }
    return CurrentLifetimeData;
}());
exports.CurrentLifetimeData = CurrentLifetimeData;
//# sourceMappingURL=stats-data.interface.js.map