"use strict";
var skilltype_enum_1 = require('./skills/skilltype.enum');
function randomChoice(arr) {
    console.assert(arr.length > 0);
    var index = Math.floor(Math.random() * arr.length);
    return arr[index];
}
exports.randomChoice = randomChoice;
function formatPct(num, decimalPlaces) {
    if (decimalPlaces === void 0) { decimalPlaces = 0; }
    return (num * 100).toFixed(decimalPlaces) + '%';
}
exports.formatPct = formatPct;
function randomSkill() {
    return Math.floor(Math.random() * skilltype_enum_1.SkillType.MAX);
}
exports.randomSkill = randomSkill;
//# sourceMappingURL=utils.js.map