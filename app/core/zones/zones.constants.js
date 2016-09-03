"use strict";
var zones_data_defns_1 = require('./zones.data.defns');
var index_1 = require('../skills/index');
var index_2 = require('../stats/index');
var action_oneshots_enum_1 = require('./action-oneshots.enum');
var CHEAT_POINTS = 5000;
var FLOWERS = ["poppies", "daisies", "roses", "orchids", "violets", "begonias"];
exports.SUPERZONEDATA = [
    {
        name: 'Fields',
        minLevel: 0,
        zones: [
            {
                name: 'Turnip Farm',
                description: "A good place for apprentice farmers to learn the ways of\n            the land - turnips are a pretty forgiving crop.",
                actions: [
                    { vb: "pull", obj: "a turnip", skills: index_1.SkillType.Farming },
                    { vb: "pull", obj: "a HUGE turnip", skills: index_1.SkillType.Farming, bonusLevel: 1 },
                ],
                difficulty: 0,
            },
            {
                name: 'Woody Woods',
                description: "A small forest where locals go to collect firewood.\n        Watch out for critters.",
                actions: [
                    { vb: "chop", obj: "__X", opts: ["an oak", "a spruce", "a pine"],
                        skills: index_1.SkillType.Survival, weight: .8 },
                    { vb: "ax", obj: "a __X", opts: ["rat", "rabid deer", "badger", "spider"],
                        skills: index_1.SkillType.Combat, weight: .2 },
                    { vb: "free", obj: "the woodsman from a trap", oneShot: action_oneshots_enum_1.OneShotAction.WoodsmanFreed,
                        bonusLevel: 2, skills: index_1.SkillType.Survival }
                ],
                difficulty: 1,
            },
            {
                name: 'Stables',
                description: "If Hercules wasn't too good to clean stables, then neither\n        are you",
                actions: [
                    { vb: "ride", obj: "a steed", skills: index_1.SkillType.Riding, weight: 1, difficulty: zones_data_defns_1.additiveOverride(-1) },
                    { vb: "drive", obj: "a plough", skills: [index_1.SkillType.Riding, index_1.SkillType.Farming],
                        weight: 1, difficulty: zones_data_defns_1.additiveOverride(-1) },
                    { vb: "bale", obj: "some hay", skills: index_1.SkillType.Farming, weight: 1 }
                ],
                difficulty: 3,
            },
            {
                name: 'Flower Fields',
                description: 'Row upon row of pretty, pretty flowers',
                actions: [
                    { vb: 'plant', obj: 'some __X', opts: FLOWERS, skills: index_1.SkillType.Farming,
                        difficulty: zones_data_defns_1.additiveOverride(9) },
                    { vb: 'pick', obj: 'a bouquet of __X', opts: FLOWERS, skills: [index_1.SkillType.Farming, index_1.SkillType.Charm] },
                    { vb: 'tiptoe', obj: 'through the tulips', skills: index_1.SkillType.Stealth,
                        bonusLevel: .5, difficulty: zones_data_defns_1.additiveOverride(-1) },
                ],
                difficulty: 4,
            },
        ] },
    {
        name: 'Village',
        minLevel: 5,
        zones: [
            {
                name: 'Chapel',
                description: 'A place of worship',
                actions: [
                    { vb: "pray", obj: "", skills: index_1.SkillType.Piety },
                ],
                difficulty: 4,
            },
            {
                name: 'General Store',
                description: 'A generally good place to steal',
                actions: [
                    { vb: "nick", obj: "a knicknack", skills: index_1.SkillType.Stealth },
                    { vb: "nick", obj: "an antique", skills: index_1.SkillType.Stealth, bonusLevel: 1 },
                    { vb: "nick", obj: "a priceless artifact", skills: index_1.SkillType.Stealth, bonusLevel: 2 },
                ],
                difficulty: 7
            },
            {
                name: 'Tavern',
                description: 'A place of merriment. And occasional brawls.',
                actions: [
                    { vb: "dance", obj: "a jig", skills: index_1.SkillType.Charm, weight: 1 },
                    { vb: "play", obj: "darts", skills: index_1.SkillType.Charm, weight: 1 },
                    { vb: "sing", obj: "some epic karaoke", skills: index_1.SkillType.Charm, bonusLevel: 1 },
                    { vb: "fight", obj: "a drunken patron", skills: index_1.SkillType.Combat, weight: 1 },
                ],
                difficulty: 10,
            },
            {
                name: 'Tournament',
                description: 'A local jousting competition',
                actions: [
                    { vb: "joust", obj: "in an exhibition match",
                        skills: [index_1.SkillType.Riding, index_1.SkillType.Charm], weight: 3.0 },
                    { vb: "joust", obj: "in a qualifying match",
                        skills: [index_1.SkillType.Riding, index_1.SkillType.Charm], bonusLevel: .3 },
                    { vb: "joust", obj: "in a quarterfinal match",
                        skills: [index_1.SkillType.Riding, index_1.SkillType.Charm], bonusLevel: 1 },
                    { vb: "joust", obj: "in a semifinal match",
                        skills: [index_1.SkillType.Riding, index_1.SkillType.Charm], bonusLevel: 2 },
                    { vb: "joust", obj: "in the *grand final* match",
                        skills: [index_1.SkillType.Riding, index_1.SkillType.Charm], bonusLevel: 3,
                        unlocks: index_2.NamedUnlock.JoustingChampion, oneShot: action_oneshots_enum_1.OneShotAction.TournamentFinals },
                ],
                difficulty: 12,
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
                    { vb: 'collect', obj: 'a mushroom', skills: [index_1.SkillType.Farming, index_1.SkillType.Intellect] },
                    { vb: 'concoct', obj: 'a draught of __X',
                        opts: ["sleep", "dizziness", "wart removal", "blindness", "cheer"],
                        skills: [index_1.SkillType.Intellect] }
                ],
                difficulty: 14,
            },
            {
                name: 'Deep Cave',
                description: 'This place is dangerous',
                actions: [
                    { vb: 'crawl', obj: 'through a narrow passage', skills: [index_1.SkillType.Survival] },
                    { vb: 'dodge', obj: 'a falling stalctite', skills: [index_1.SkillType.Survival],
                        bonusLevel: .5 },
                    { vb: 'dodge', obj: "a falling stalagmite. Wait, that's not right, is it?",
                        skills: [index_1.SkillType.Survival], bonusLevel: .5, weight: 0.001 },
                    { vb: 'swim', obj: 'through a sump', skills: [index_1.SkillType.Survival], bonusLevel: 1 },
                ],
                difficulty: 16,
            },
            {
                name: 'Bat Cave',
                description: "These bats haven't been doing anyone harm, but I guess you\n        could slaughter them anyways for practice",
                actions: [
                    { vb: 'slay', obj: 'a fruit bat', skills: [index_1.SkillType.Combat] },
                    { vb: 'slay', obj: 'a vampire bat', skills: [index_1.SkillType.Combat], bonusLevel: .5 },
                    { vb: 'slay', obj: 'the Bat King', skills: [index_1.SkillType.Combat],
                        bonusLevel: 2, weight: .05, oneShot: action_oneshots_enum_1.OneShotAction.BatKing }
                ],
                difficulty: 18,
            },
            {
                name: 'Haunted Cave',
                description: "Townsfolk steer clear of this cave. Local legend says that it's spooky.",
                actions: [
                    { vb: 'light', obj: 'some incense', skills: index_1.SkillType.Piety },
                    { vb: 'exorcise', obj: 'a restless spirit', skills: [index_1.SkillType.Piety, index_1.SkillType.Combat],
                        bonusLevel: .5 },
                    { vb: 'exorcise', obj: 'an ancient, unspeakable horror',
                        skills: [index_1.SkillType.Piety, index_1.SkillType.Combat], bonusLevel: 1.5 },
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
                    { vb: "ponder", obj: "a quaint and curious volume of forgotten lore",
                        skills: [index_1.SkillType.Intellect, index_1.SkillType.Stealth], bonusLevel: 1,
                        skillRatios: { 'Intellect': .8, 'Stealth': .2 } },
                    { vb: "read", obj: "a __X", opts: ["tome", "book", "encyclopedia", "magazine"],
                        skills: [index_1.SkillType.Intellect, index_1.SkillType.Stealth],
                        skillRatios: { 'Intellect': .8, 'Stealth': .2 } },
                ],
                difficulty: 22,
            },
            {
                name: 'Botanical Garden',
                description: "A showcase of rare and exotic plants",
                actions: [
                    { vb: "bask", obj: "in the sun", skills: index_1.SkillType.Charm, weight: .2 },
                    { vb: "inspect", obj: "an unusual cultivar of __X",
                        opts: ["radish", "turnip", "parsley", "carrot", "pumpkin"],
                        skills: index_1.SkillType.Farming },
                    { vb: "pluck", obj: "a weed", skills: index_1.SkillType.Farming },
                    { vb: "chat", obj: "with the head gardener", skills: [index_1.SkillType.Farming, index_1.SkillType.Charm],
                        bonusLevel: 1.5 }
                ],
                difficulty: 25,
            },
            {
                name: 'Colloseum',
                description: "A violent but popular local spectacle. Successful gladiators\n        are handy with a sword and know how to razzle-dazzle the crowd.",
                actions: [
                    { vb: "fight", obj: "a gladiator", skills: [index_1.SkillType.Combat] },
                    { vb: "ham", obj: "it up for the crowd", skills: [index_1.SkillType.Charm] },
                    { vb: "fight", obj: "a __X", opts: ["tiger", "lion", "wolf", "boar"],
                        skills: [index_1.SkillType.Combat], bonusLevel: .5 },
                    { vb: "bask", obj: "in the crowd's adoration", skills: index_1.SkillType.Charm,
                        bonusLevel: 1 }
                ],
                difficulty: 28,
            },
            {
                name: 'Cathedral',
                description: 'Nice stained glass',
                actions: [
                    { vb: "sermonize", obj: "", skills: [index_1.SkillType.Piety, index_1.SkillType.Charm] },
                    { vb: "proselytize", obj: "", skills: [index_1.SkillType.Piety, index_1.SkillType.Charm] },
                    { vb: "harmonize", obj: "", skills: [index_1.SkillType.Charm] },
                    { vb: "eulogize", obj: "", skills: [index_1.SkillType.Piety, index_1.SkillType.Charm], bonusLevel: 1.5 },
                ],
                difficulty: 31,
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
        minLevel: 50,
        zones: [
            {
                name: 'Bandit Camp',
                description: "These bandits have been accosting travelers and generally\n        acting like jerks",
                actions: [
                    { vb: 'apprehend', obj: "a bandit", skills: [index_1.SkillType.Combat] },
                    { vb: 'steal', obj: "stolen goods", skills: [index_1.SkillType.Stealth] },
                    { vb: 'assassinate', obj: "the Chief Bandit",
                        skills: [index_1.SkillType.Stealth, index_1.SkillType.Combat], bonusLevel: 3, oneShot: action_oneshots_enum_1.OneShotAction.BanditChief },
                ],
                difficulty: 50,
            },
            {
                name: 'Gryphon Nest',
                description: 'Scouts spotted the nest of a great gryphon on a mountain top',
                actions: [
                    { vb: "climb", obj: "", skills: index_1.SkillType.Survival, weight: 1.0 },
                    { vb: "sneak", obj: "an egg out of the nest", skills: index_1.SkillType.Stealth, weight: .2 },
                    { vb: "ride", obj: "a great gryphon", skills: index_1.SkillType.Riding, bonusLevel: 2 },
                    { vb: "sneak", obj: "a golden egg", skills: index_1.SkillType.Stealth, bonusLevel: 3,
                        oneShot: action_oneshots_enum_1.OneShotAction.GoldenEgg },
                ],
                difficulty: 55,
            },
            {
                name: 'Ancient Ruins',
                description: 'Ruins left by an ancient civilization',
                actions: [
                    { vb: "disarm", obj: "a booby trap", skills: index_1.SkillType.Survival },
                    { vb: "decode", obj: "some ancient glyphs", skills: index_1.SkillType.Intellect },
                    { vb: "deface", obj: "an altar to a pagan god", skills: index_1.SkillType.Piety,
                        bonusLevel: 1 },
                    { vb: "unlock", obj: "the secrets of the Jade McGuffin", skills: index_1.SkillType.Intellect,
                        bonusLevel: 3, oneShot: action_oneshots_enum_1.OneShotAction.McMuffin },
                ],
                difficulty: 60,
            },
            {
                name: 'Goblin Outpost',
                description: 'Smells awful',
                actions: [
                    { vb: "slay", obj: "a goblin", skills: index_1.SkillType.Combat },
                    { vb: "slay", obj: "a goblin lieutenant", skills: index_1.SkillType.Combat, bonusLevel: 1 },
                    { vb: "slay", obj: "the Goblin King", skills: index_1.SkillType.Combat, bonusLevel: 3,
                        oneShot: action_oneshots_enum_1.OneShotAction.GoblinKing },
                ],
                difficulty: 65,
            }
        ]
    },
    {
        name: 'Beyond',
        minLevel: 99,
        zones: [
            {
                name: 'Crack in Spacetime',
                description: "Some chronomancers had a teensy accident and may have" +
                    " created a bit of a singularity-type situation. It'll take a very " +
                    "seasoned hero to get through this.",
                actions: [
                    { vb: 'beat', obj: 'the game', skills: [
                            index_1.SkillType.Farming, index_1.SkillType.Combat, index_1.SkillType.Survival, index_1.SkillType.Charm, index_1.SkillType.Stealth, index_1.SkillType.Riding,
                            index_1.SkillType.Intellect, index_1.SkillType.Piety],
                        unlocks: index_2.NamedUnlock.SpaceTimeConquered
                    }
                ],
                difficulty: 100
            }
        ]
    },
    {
        name: 'Cheatz',
        minLevel: 1,
        cheat: true,
        zones: [
            {
                name: 'Cheat 1',
                description: 'zz',
                actions: [
                    { vb: "zz", obj: "", skills: [
                            index_1.SkillType.Farming, index_1.SkillType.Combat, index_1.SkillType.Survival, index_1.SkillType.Charm, index_1.SkillType.Stealth, index_1.SkillType.Riding,
                            index_1.SkillType.Intellect, index_1.SkillType.Piety
                        ], bonusLevel: 2 }
                ],
                difficulty: -5,
            },
            {
                name: 'Cheat 2',
                description: 'zz',
                actions: [
                    { vb: "zz", obj: "", skills: [
                            index_1.SkillType.Farming, index_1.SkillType.Combat, index_1.SkillType.Survival, index_1.SkillType.Charm, index_1.SkillType.Stealth, index_1.SkillType.Riding,
                            index_1.SkillType.Intellect, index_1.SkillType.Piety
                        ], bonusLevel: 3 }
                ],
                difficulty: -5,
            },
            {
                name: 'Cheat 4',
                description: 'zz',
                actions: [
                    { vb: "zz", obj: "", skills: [
                            index_1.SkillType.Farming, index_1.SkillType.Combat, index_1.SkillType.Survival, index_1.SkillType.Charm, index_1.SkillType.Stealth, index_1.SkillType.Riding,
                            index_1.SkillType.Intellect, index_1.SkillType.Piety
                        ], bonusLevel: 4 }
                ],
                difficulty: -5,
            }
        ]
    }
];
//# sourceMappingURL=zones.constants.js.map