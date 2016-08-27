import {    SuperZoneData,
            multiplicativeOverride as MULT,
            additiveOverride as PLUS
        } from './zones.data.defns';
import { SkillType as S } from '../skills/index';
import { NamedUnlock } from '../stats/index';

let CHEAT_POINTS = 5000;
let FLOWERS = ["poppies", "daisies", "roses", "orchids", "violets", "begonias"];

export const SUPERZONEDATA: SuperZoneData[] = [
{
name: 'Fields',
minLevel: 0,
zones:
[
    {
        name: 'Turnip Farm',
        description: `A good place for apprentice farmers to learn the ways of
            the land - turnips are a pretty forgiving crop.`,
        actions: [
            {vb: "pull", obj:"a turnip", skills: S.Farming},
            {vb: "pull", obj:"a HUGE turnip", skills: S.Farming, bonusLevel: 1},
        ],
        difficulty: 0,
    },
    {
        name: 'Woody Woods',
        description: `A young-growth forest with small trees suitable for amateur
            lumberjacks. Small critters are known to occasionally attack.`,
        actions: [
            {vb: "chop", obj:"a young __X", opts:["oak", "spruce", "pine"],
                skills: S.Survival, weight: .8},
            {vb: "ax", obj:"a __X", opts:["rat", "rabid deer", "badger", "spider"],
                skills: S.Combat, weight: .2},
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
        difficulty: 3,
    },
    // {
    //     name: 'Cheatzone',
    //     description: 'Cheatz',
    //     actions: [
    //         {vb: 'cheat', obj: 'the game', skills: [S.Farming, S.Riding, S.Charm, S.Stealth, S.Piety],
    //             gains: PLUS(CHEAT_POINTS)}
    //         ],
    //     difficulty: 0,
    // },
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
name: 'Village',
minLevel: 5,
zones:
[
    {
        name: 'General Store',
        description: 'A place to steal',
        actions: [
            {vb: "nick", obj: "a knicknack", skills: S.Stealth},
            {vb: "nick", obj: "an antique", skills: S.Stealth, bonusLevel: 1},
            {vb: "nick", obj: "a priceless artifact", skills: S.Stealth, bonusLevel: 2},
        ],
        difficulty: 4
    },
    {
        name: 'Chapel',
        description: 'A place of worship',
        actions: [
            {vb: "pray", obj:"", skills: S.Piety},
        ],
        difficulty: 5,
    },
    {
        name: 'Tavern',
        description: 'Get sloshed',
        actions: [
            {vb: "dance", obj: "a jig", skills: S.Charm, weight: .8},
            {vb: "fight", obj: "a drunken patron", skills: S.Combat, weight: .2},
        ],
        difficulty: 7,
    },
    {
        name: 'Tournament',
        description: 'Win a medal',
        actions: [
            {vb: "joust", obj: "in an exhibition match",
            skills: [S.Riding, S.Charm], weight: 3.0},
            {vb: "joust", obj:"in a qualifying match",
            skills: [S.Riding, S.Charm], bonusLevel:.3},
            {vb: "joust", obj:"in a quarterfinal match",
            skills: [S.Riding, S.Charm], bonusLevel:1},
            {vb: "joust", obj:"in a semifinal match",
            skills: [S.Riding, S.Charm], bonusLevel:2},
            {vb: "joust", obj:"in the *grand final* match",
            skills: [S.Riding, S.Charm], bonusLevel:3,
            unlocks: NamedUnlock.JoustingChampion},
        ],
        difficulty: 8,
    }


]
},

{
name: 'Hinterlands',
minLevel: 15,
zones: [
    {
        name: 'Mushroom Cave',
        description: 'A grotto where mycologists cultivate mushrooms with curative, poisonous, or psychedelic properties',
        actions: [
            {vb: 'collect', obj: 'a mushroom', skills: [S.Farming, S.Intellect]}
        ],
        difficulty: 15,
    },
    {
        name: 'Gryphon Nest',
        description: 'Scouts spotted the nest of a great gryphon on a mountain top',
        actions: [
            {vb: "climb", obj:"", skills: S.Survival, weight:1.0},
            {vb: "sneak", obj: "an egg out of the nest", skills: S.Stealth, weight: .2},
            {vb: "ride", obj: "a great gryphon", skills: S.Riding, bonusLevel:1},
        ],
        difficulty: 16,
    },
    {
        name: 'Ancient Ruins',
        description: 'Ruins left by an ancient civilization',
        actions: [
            {vb: "disarm", obj: "a booby trap", skills: S.Stealth},
            {vb: "decode", obj: "some ancient glyphs", skills: S.Intellect},
        ],
        difficulty: 20,
    },

]
},

{
name: 'City',
minLevel: 30,
zones: [
    {
        name: 'Library',
        description: 'A good place to get smarter and practice being quiet',
        actions: [
            {vb: "ponder", obj: "a quaint and curious volume of forgotten lore",
                skills: [S.Intellect, S.Stealth], weight:.05, difficulty: PLUS(1),
                gains: MULT(3), skillRatios: {'Intellect': .8, 'Stealth': .2}},
            {vb: "read", obj:"a __X", opts: ["tome", "book", "encyclopedia", "magazine"],
                skills: [S.Intellect, S.Stealth], weight: .9,
                skillRatios: {'Intellect': .8, 'Stealth': .2} },
        ],
        difficulty: 30,
    },
    {
        name: 'Colloseum',
        description: "Fight for the crowd's affection.",
        actions: [
            {vb: "fight", obj:"", skills: [S.Combat, S.Charm]},
        ],
        difficulty: 35,
    },
]
}

];
