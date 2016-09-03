"use strict";
var skilltype_enum_1 = require('./skilltype.enum');
function uniformSkillMap(repeatedValue) {
    return skillMapFromFactory(function (s) { return repeatedValue; });
}
exports.uniformSkillMap = uniformSkillMap;
function zeroSkillMap() {
    return uniformSkillMap(0);
}
exports.zeroSkillMap = zeroSkillMap;
function mostlyUniformSkillMap(repeatedValue, exceptions) {
    var tees = new Array(skilltype_enum_1.SkillType.MAX);
    for (var skillId = 0; skillId < skilltype_enum_1.SkillType.MAX; skillId++) {
        if (exceptions.hasOwnProperty(skillId)) {
            tees[skillId] = exceptions[skillId];
        }
        else {
            tees[skillId] = repeatedValue;
        }
    }
    return tees;
}
exports.mostlyUniformSkillMap = mostlyUniformSkillMap;
exports.JSONtoSkillMap = JSONtoSkillMapFactory();
function dictToSkillMap(dict) {
    var sm = new Array(skilltype_enum_1.SkillType.MAX);
    for (var skillName in dict) {
        var idx = skilltype_enum_1.SkillType[skillName];
        sm[idx] = dict[skillName];
    }
    return sm;
}
exports.dictToSkillMap = dictToSkillMap;
function skillMapFromFactory(initFactory) {
    var tees = new Array(skilltype_enum_1.SkillType.MAX);
    for (var skillId = 0; skillId < skilltype_enum_1.SkillType.MAX; skillId++) {
        tees[skillId] = initFactory(skillId);
    }
    return tees;
}
exports.skillMapFromFactory = skillMapFromFactory;
function getTruthySkills(sm) {
    var skills = new Array();
    for (var skillId = 0; skillId < skilltype_enum_1.SkillType.MAX; skillId++) {
        var value = sm[skillId];
        if (value) {
            skills.push(skillId);
        }
    }
    return skills;
}
exports.getTruthySkills = getTruthySkills;
// ------------ Private --------------------
function JSONtoSkillMapFactory() {
    return function (j) {
        var tees = new Array(skilltype_enum_1.SkillType.MAX);
        for (var skillId = 0; skillId < skilltype_enum_1.SkillType.MAX; skillId++) {
            if (j.hasOwnProperty(skillId)) {
                tees[skillId] = j[skillId];
            }
            else {
            }
        }
        return tees;
    };
}
function JSONtoSkillMapOf(j) {
    return JSONtoSkillMapFactory()(j);
}
//# sourceMappingURL=skillmap.js.map