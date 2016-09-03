"use strict";
(function (SkillType) {
    SkillType[SkillType["Farming"] = 0] = "Farming";
    SkillType[SkillType["Combat"] = 1] = "Combat";
    SkillType[SkillType["Survival"] = 2] = "Survival";
    SkillType[SkillType["Charm"] = 3] = "Charm";
    SkillType[SkillType["Stealth"] = 4] = "Stealth";
    SkillType[SkillType["Riding"] = 5] = "Riding";
    SkillType[SkillType["Intellect"] = 6] = "Intellect";
    SkillType[SkillType["Piety"] = 7] = "Piety";
    SkillType[SkillType["MAX"] = 8] = "MAX";
})(exports.SkillType || (exports.SkillType = {}));
var SkillType = exports.SkillType;
var skill_images_wesnoth = [
    'pitchfork.png',
    'sword-human.png',
    'torch.png',
    'instrument_kantele.png',
    'sandals.png',
    'fangs.png',
    'scroll_red.png',
    'ankh_necklace.png'
];
exports.skill_images = [
    'fedhas.png',
    'long_blades.png',
    'ice_magic.png',
    'nemelex_xobeh.png',
    'stealth.png',
    'unarmed_combat_paw.png',
    'spellcasting.png',
    'invocations.png'
].map(function (fname) { return 'assets/skills_dcss/' + fname; });
//# sourceMappingURL=skilltype.enum.js.map