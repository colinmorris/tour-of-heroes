import { Zone } from './zone';
import { SkillType as S } from './skill';

export const ZONES : Zone[] = [];

let ZONEDATA = [
{
    name: 'Turnip Farm',
    description: `A good place for apprentice farmers to learn the ways of
        the land - turnips are a pretty forgiving crop.`,
    actions: [
        {vb: "pull", obj:"a turnip", skills: {[S.Farming]: 1}, weight: .9},
        {vb: "pull", obj:"a HUGE turnip", skills: {[S.Farming]: 10}, weight: .02, delayx:2},
    ],
},
{
    name: 'Woody Woods',
    description: `A young-growth forest with small trees suitable for amateur
        lumberjacks. Small critters are known to occasionally attack.`,
    actions: [
        {vb: "chop", obj:"a young __X", opts:["oak", "spruce", "pine"], skills: {[S.Woodcutting]: 1}, weight: .8},
        {vb: "ax", obj:"a __X", opts:["rat", "rabid deer", "badger", "spider"], skills: {[S.Combat]: 1}, weight: .2},
    ],
},
]

let id = 0;
for (let obj of ZONEDATA) {
    ZONES.push(Zone.fromJSON(obj, id++));
}
        
