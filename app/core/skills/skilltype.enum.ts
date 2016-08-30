export enum SkillType {
    Farming = 0,
    Combat,
    Survival,

    Charm,
    Stealth,

    Riding,
    Intellect,
    Piety,
    MAX,
}

let skill_images_wesnoth: string[] = [
    'pitchfork.png',
    'sword-human.png',
    'torch.png',

    'instrument_kantele.png',
    'sandals.png',

    'fangs.png',
    'scroll_red.png',
    'ankh_necklace.png'
]

export const skill_images: string[] = [
    'fedhas.png',
    'long_blades.png',
    'ice_magic.png',

    'nemelex_xobeh.png',
    'stealth.png',

    'unarmed_combat_paw.png',
    'spellcasting.png',
    'invocations.png'
].map( (fname: string) => 'assets/skills_dcss/' + fname );
