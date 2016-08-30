import {    SuperZoneData,
            multiplicativeOverride as MULT,
            additiveOverride as PLUS
        } from './zones.data.defns';
import { SkillType as S } from '../skills/index';
import { NamedUnlock } from '../stats/index';
import { OneShotAction as OS } from './action-oneshots.enum';

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
    {
        name: 'Flower Fields',
        description: 'Rows upon rows of pretty flowers',
        actions: [
            {vb: 'plant', obj: 'some __X', opts:FLOWERS, skills: S.Farming,
            difficulty:PLUS(3)},
            {vb: 'pick', obj: 'a bouquet of __X', opts:FLOWERS, skills: [S.Farming, S.Charm]},
            {vb: 'tiptoe', obj: 'through the tulips', skills: S.Stealth, bonusLevel:.5},
        ],
        difficulty: 4,
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
            {vb: "dance", obj: "a jig", skills: S.Charm, weight: 1},
            {vb: "fight", obj: "a drunken patron", skills: S.Combat, weight: 1},
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
            unlocks: NamedUnlock.JoustingChampion, oneShot: OS.TournamentFinals},
        ],
        difficulty: 8,
    }


]
},

{
name: 'Cave Complex',
minLevel: 12,
zones: [
    {
        name: 'Mushroom Cave',
        description: 'A grotto where mycologists cultivate mushrooms with curative, poisonous, or psychedelic properties',
        actions: [
            {vb: 'collect', obj: 'a mushroom', skills: [S.Farming, S.Intellect]},
            {vb: 'concoct', obj: 'a draught', skills: [S.Intellect]}
        ],
        difficulty: 14,
    },
    {
        name: 'Deep Cave',
        description: 'This place is dangerous',
        actions: [
            {vb: 'crawl', obj: 'through a narrow passage', skills: [S.Survival]},
            {vb: 'dodge', obj: 'a falling stalctite', skills: [S.Survival],
                bonusLevel:.5},
            {vb: 'dodge', obj: "a falling stalagmite. Wait, that's not right, is it?",
                skills: [S.Survival], bonusLevel:.5, weight: 0.001},
            {vb: 'swim', obj: 'through a sump', skills: [S.Survival], bonusLevel: 1},
        ],
        difficulty: 16,
    },
    {
        name: 'Bat Cave',
        description: 'Dumb bats',
        actions: [
            {vb: 'slay', obj: 'a fruit bat', skills: [S.Combat]},
            {vb: 'slay', obj: 'a vampire bat', skills: [S.Combat], bonusLevel:.5},
            {vb: 'slay', obj: 'the Bat King', skills: [S.Combat],
                bonusLevel:2, weight: .05, oneShot: OS.BatKing}
        ],
        difficulty: 18,
    },
    {
        name: 'Haunted Cave',
        description: "It's haunted, yo",
        actions: [
            {vb: 'light', obj: 'some incense', skills: S.Piety},
            {vb: 'exorcise', obj: 'a restless spirit', skills: [S.Piety, S.Combat],
                bonusLevel:.5},
            {vb: 'exorcise', obj: 'an ancient, unspeakable horror',
                skills: [S.Piety, S.Combat], bonusLevel:1.5},
        ],
        difficulty: 19,
    }

]
},

{
name: 'City',
minLevel: 20,
zones: [
    {
        /** This could be interesting as a 'rainbow' zone. Read a book about
            plants/martial strategy/religion/whatever, and gain SP in the
            corresponding skill + intellect.
        **/
        name: 'Library',
        description: 'A good place to get smarter and practice being quiet',
        actions: [
            {vb: "ponder", obj: "a quaint and curious volume of forgotten lore",
                skills: [S.Intellect, S.Stealth], bonusLevel: 1,
                skillRatios: {'Intellect': .8, 'Stealth': .2}},
            {vb: "read", obj:"a __X", opts: ["tome", "book", "encyclopedia", "magazine"],
                skills: [S.Intellect, S.Stealth],
                skillRatios: {'Intellect': .8, 'Stealth': .2} },
        ],
        difficulty: 20,
    },
    {
        name: 'Botanical Garden',
        description: 'Plants',
        actions: [
            {vb: "bask", obj:"in the sun", skills:S.Charm, weight:.2},
            {vb: "inspect", obj:"an unusual cultivar of __X",
            opts:["radish", "turnip", "parsley", "carrot", "pumpkin"],
            skills:S.Farming},
            {vb: "pluck", obj:"a weed", skills:S.Farming},
            {vb: "chat", obj:"with the head gardener", skills:[S.Farming, S.Charm]}
        ],
        difficulty: 23,
    },
    {
        name: 'Colloseum',
        description: "Fight for the crowd's affection.",
        actions: [
            {vb: "fight", obj:"a gladiator", skills: [S.Combat]},
            {vb: "ham", obj:"it up for the crowd", skills: [S.Charm]},
            {vb: "fight", obj:"a __X", opts: ["tiger", "lion", "wolf", "boar"],
                skills: [S.Combat], bonusLevel: .5},
            {vb: "bask", obj:"in the crowd's adoration", skills:S.Charm,
                bonusLevel:1}
        ],
        difficulty: 25,
    },
    {
        name: 'Cathedral',
        description: 'Nice stained glass',
        actions: [
            {vb: "sermonize", obj:"", skills:[S.Piety, S.Charm]},
            {vb: "proselytize", obj:"", skills:[S.Piety, S.Charm]},
            {vb: "harmonize", obj:"", skills:[S.Charm]},
        ],
        difficulty: 26,
    }
]
},

// {
// name: 'Coast',
// minLevel: 40,
// zones: [
//
// ]
// },

{
name: 'Hinterlands',
minLevel: 30,
zones: [
    {
        name: 'Bandit Camp',
        description: "bandits",
        actions: [
            {vb: 'apprehend', obj:"a bandit", skills:[S.Combat]},
            {vb: 'stealing', obj:"stolen goods", skills:[S.Stealth]},
        ],
        difficulty: 30,
    },
    {
        name: 'Gryphon Nest',
        description: 'Scouts spotted the nest of a great gryphon on a mountain top',
        actions: [
            {vb: "climb", obj:"", skills: S.Survival, weight:1.0},
            {vb: "sneak", obj: "an egg out of the nest", skills: S.Stealth, weight: .2},
            {vb: "ride", obj: "a great gryphon", skills: S.Riding, bonusLevel:1},
        ],
        difficulty: 33,
    },
    {
        name: 'Ancient Ruins',
        description: 'Ruins left by an ancient civilization',
        actions: [
            {vb: "disarm", obj: "a booby trap", skills: S.Stealth},
            {vb: "decode", obj: "some ancient glyphs", skills: S.Intellect},
        ],
        difficulty: 36,
    },

]
},

{
name: 'Cheatz',
minLevel: 999,
cheat: true,
zones: [
    {
        name: 'Cheat 1',
        description: 'zz',
        actions: [
            {vb: "zz", obj:"",skills:[
                S.Farming, S.Combat, S.Survival, S.Charm, S.Stealth, S.Riding,
                S.Intellect, S.Piety
            ], bonusLevel:2}
        ],
        difficulty: 1,
    },
    {
        name: 'Cheat 2',
        description: 'zz',
        actions: [
            {vb: "zz", obj:"",skills:[
                S.Farming, S.Combat, S.Survival, S.Charm, S.Stealth, S.Riding,
                S.Intellect, S.Piety
            ], bonusLevel:3}
        ],
        difficulty: 1,
    },
    {
        name: 'Cheat 4',
        description: 'zz',
        actions: [
            {vb: "zz", obj:"",skills:[
                S.Farming, S.Combat, S.Survival, S.Charm, S.Stealth, S.Riding,
                S.Intellect, S.Piety
            ], bonusLevel:4}
        ],
        difficulty: 1,
    }
]
}

];
