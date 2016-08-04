import { Zone } from './zone';
import { SkillType as S } from './skill';

export const ZONES : Object = {}; //{string: Zone[]} = {};
export const ZONESARR : Zone[] = [];
export const SUPERZONES: string[] = [];

let CHEAT_POINTS = 5000;

// TODO: Define an interface for these so compiler can catch missing fields
let ZONEDATA = {
'fields':
    [
{
    name: 'Turnip Farm',
    description: `A good place for apprentice farmers to learn the ways of
        the land - turnips are a pretty forgiving crop.`,
    actions: [
        {vb: "pull", obj:"a turnip", skills: {[S.Farming]: 2}, weight: .9},
        {vb: "pull", obj:"a HUGE turnip", skills: {[S.Farming]: 10}, weight: .05, delayx:.1},
    ],
},
{
    name: 'Woody Woods',
    description: `A young-growth forest with small trees suitable for amateur
        lumberjacks. Small critters are known to occasionally attack.`,
    actions: [
        {vb: "chop", obj:"a young __X", opts:["oak", "spruce", "pine"], skills: {[S.Woodcutting]: 2}, weight: .8},
        {vb: "ax", obj:"a __X", opts:["rat", "rabid deer", "badger", "spider"], skills: {[S.Combat]: 2}, weight: .2},
    ],
},
{
    name: 'County Farm',
    description: 'For champion farmers only',
    actions: [
        {vb: "win", obj: "first place in pumpkin compeition", 
            skills: {[S.Farming]: 6}, weight:1 },
    ],
},
{
    name: 'Stables',
    description: 'A place with horses',
    actions: [
        {vb: "ride", obj: "a steed", skills: {[S.Riding]: 2}, weight: .5},
        {vb: "bale", obj: "some hay", skills: {[S.Farming]: 5}, weight: .5}
    ],
},
{
    name: 'Cheatzone',
    description: 'Cheatz',
    actions: [
        {vb: 'cheat', obj: 'the game', skills: 
            // TODO: The fact that delayx needs to be set so ridiculously suggests that maybe zones/actions should be able
            // to disentangle skill gains and skill thresholds/mastery levels
            {[S.Farming]: CHEAT_POINTS, [S.Riding]: CHEAT_POINTS, [S.Charm]: CHEAT_POINTS, [S.Stealth]:CHEAT_POINTS}, weight:1.0, delayx:1.0},
        ]
},
],

'city': [
{
    name: 'Library',
    description: 'A good place to get smarter and practice being quiet',
    actions: [
        {vb: "ponder", obj: "a quaint and curious volume of forgotten lore", skills: {[S.Intellect]: 10, [S.Stealth]: 1}, weight:.05, delayx:.2},
        {vb: "read", obj:"__X", opts: ["tome", "book", "encyclopedia", "magazine"], 
            skills: {[S.Intellect]:4, [S.Stealth]:1}, weight: .9}
    ]
},
{
    name: 'Tavern',
    description: 'Get sloshed',
    actions: [
        {vb: "dance", obj: "a jig", skills: {[S.Dance]:2, [S.Charm]:2}, weight: .8},
        {vb: "fight", obj: "a drunken patron", skills: {[S.Combat]:4}, weight: .2},
    ]
},
],
}

let id = 0;
for (let superzone in ZONEDATA) {
    SUPERZONES.push(superzone);
    ZONES[superzone] = [];
    for (let obj of ZONEDATA[superzone]) {
        let z: Zone = Zone.fromJSON(obj, id++, superzone);
        // ZZZZZZZ
        ZONES[superzone].push(z);
        ZONESARR.push(z);
    }
}
