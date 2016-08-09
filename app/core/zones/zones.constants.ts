import { SuperZone,
            multiplicativeOverride as MULT,
            additiveOverride as PLUS
        } from './zones.data.defns';
import { SkillType as S } from '../skills/index';

let CHEAT_POINTS = 5000;
let FLOWERS = ["poppies", "daisies", "roses", "orchids", "violets", "begonias"];

export const ZONEDATA: SuperZone[] = [
{
name: 'fields',
zones:
    [
{
    name: 'Turnip Farm',
    description: `A good place for apprentice farmers to learn the ways of
        the land - turnips are a pretty forgiving crop.`,
    actions: [
        {vb: "pull", obj:"a turnip", skills: S.Farming, weight: .9},
        {vb: "pull", obj:"a HUGE turnip", skills: S.Farming, weight: .05, gains: MULT(10), mastery: PLUS(3)},
    ],
    difficulty: 0,
},
{
    name: 'Woody Woods',
    description: `A young-growth forest with small trees suitable for amateur
        lumberjacks. Small critters are known to occasionally attack.`,
    actions: [
        {vb: "chop", obj:"a young __X", opts:["oak", "spruce", "pine"], skills: S.Survival, weight: .8},
        {vb: "ax", obj:"a __X", opts:["rat", "rabid deer", "badger", "spider"], skills: S.Combat, weight: .2},
    ],
    difficulty: 1,
},
{
    name: 'Stables',
    description: 'A place with horses',
    actions: [
        {vb: "ride", obj: "a steed", skills: S.Riding, weight: .5, difficulty:PLUS(-1)},
        {vb: "bale", obj: "some hay", skills: S.Farming, weight: .5}
    ],
    difficulty: 2,
},
{
    name: 'Cheatzone',
    description: 'Cheatz',
    actions: [
        {vb: 'cheat', obj: 'the game', skills: [S.Farming, S.Riding, S.Charm, S.Stealth, S.Piety],
            gains: PLUS(CHEAT_POINTS)}
        ],
    difficulty: 0,
},
{
    name: 'Mushroom Cave',
    description: 'A grotto where mycologists cultivate mushrooms with curative, poisonous, or psychedelic properties',
    actions: [
        {vb: 'collect', obj: 'a mushroom', skills: [S.Farming, S.Intellect]}
    ],
    difficulty: 4,
},
{
    name: 'Flower Fields',
    description: 'Rows upon rows of pretty flowers',
    actions: [
        {vb: 'plant', obj: 'some __X', opts:FLOWERS, skills: S.Farming},
        {vb: 'pick', obj: 'a bouquet of __X', opts:FLOWERS, skills: [S.Farming, S.Charm]},
        {vb: 'tiptoe', obj: 'through the tulips', skills: S.Stealth, bonusLevel:1},
    ],
    difficulty: 5,
},


]},

{
name: 'city',
zones: [
{
    name: 'Library',
    description: 'A good place to get smarter and practice being quiet',
    actions: [
        {vb: "ponder", obj: "a quaint and curious volume of forgotten lore", skills: [S.Intellect, S.Stealth], weight:.05, difficulty: PLUS(1), gains: MULT(3), skillRatios: {'Intellect': .8, 'Stealth': .2}},
        {vb: "read", obj:"a __X", opts: ["tome", "book", "encyclopedia", "magazine"],
            skills: [S.Intellect, S.Stealth], weight: .9, skillRatios: {'Intellect': .8, 'Stealth': .2} },
    ],
    difficulty: 2,
},
{
    name: 'Tavern',
    description: 'Get sloshed',
    actions: [
        {vb: "dance", obj: "a jig", skills: S.Charm, weight: .8},
        {vb: "fight", obj: "a drunken patron", skills: S.Combat, weight: .2},
    ],
    difficulty: 3,
},
{
    name: 'Colloseum',
    description: "Fight for the crowd's affection.",
    actions: [
        {vb: "fight", obj:"", skills: [S.Combat, S.Charm]},
    ],
    difficulty: 6,
},
{
    name: 'Tournament',
    description: 'Win a medal',
    actions: [
        {vb: "joust", obj:"", skills: [S.Combat, S.Riding]},
    ],
    difficulty: 8,
},
{
    name: 'Temple',
    description: 'A place of worship',
    actions: [
        {vb: "pray", obj:"", skills: S.Piety},
    ],
    difficulty: 3,
}


]},

{
name: 'hinterlands',
zones: [
{
    name: 'Gryphon Nest',
    description: 'Scouts spotted the nest of a great gryphon on a mountain top',
    actions: [
        {vb: "climb", skills: S.Survival, weight:1.0},
        {vb: "sneak", obj: "an egg out of the nest", skills: S.Stealth, weight: .2},
        {vb: "ride", obj: "a great gryphon", skills: S.Riding, bonusLevel:1},
    ],
    difficulty: 6,
},
{
    name: 'Ancient Ruins',
    description: 'Ruins left by an ancient civilization',
    actions: [
        {vb: "disarm", obj: "a booby trap", skills: S.Stealth},
        {vb: "decode", obj: "some ancient glyphs", skills: S.Intellect},
    ],
    difficulty: 9,
},


]},

];
