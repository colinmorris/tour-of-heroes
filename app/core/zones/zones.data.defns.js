"use strict";
function staticOverride(value) {
    return function (_) { return value; };
}
exports.staticOverride = staticOverride;
function multiplicativeOverride(multiplier) {
    return function (dflt) { return dflt * multiplier; };
}
exports.multiplicativeOverride = multiplicativeOverride;
function additiveOverride(bias) {
    return function (dflt) { return dflt + bias; };
}
exports.additiveOverride = additiveOverride;
//# sourceMappingURL=zones.data.defns.js.map