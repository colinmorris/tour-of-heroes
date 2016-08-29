import { multiplicativeOverride,
    Override,
    ZoneData,
    ActionData
    } from './zones.data.defns';
import { SUPERZONEDATA } from './zones.constants';
import { GLOBALS } from '../../globals';

import { Zone, ConcreteZone, SuperZone } from './zone.interface';
import { SkillType,
    SkillMap, JSONtoSkillMap, dictToSkillMap,
    XpFormulas
 } from '../skills/index';
import { ZoneAction } from './zoneaction.interface';
import { VerbalZoneAction } from './zoneaction';
import { Verb, verbLookup } from './verb';

let difficulty_bonus_per_zone_level = 20;

export function levelUpZone(zone: Zone, toLevel: number) {
    var z: ZoneData;
    // Find the corresponding ZoneData template
    for (let superz of SUPERZONEDATA) {
        for (let zd of superz.zones) {
            if (zd.name == zone.name) {
                z = zd;
                break;
            }
        }
        if (z) {
            break;
        }
    }
    console.assert(z != undefined);
    let newDiff = leveledZoneDifficulty(z, toLevel);
    console.assert(z.name == zone.name);
    for (let i=0; i<z.actions.length; i++) {
        zone.actions[i] = zamFromJSON(z.actions[i], z, newDiff);
    }
    zone.difficulty = newDiff;
    zone.level = toLevel;
}

function leveledZoneDifficulty(zone: ZoneData, level: number) : number {
    return zone.difficulty + (level * difficulty_bonus_per_zone_level);
}

export function loadSuperZones(zoneLevels: {[zoneName:string]: number}) : SuperZone[] {
    let superzones: SuperZone[] = [];
    let id = 0;
    for (let superzone of SUPERZONEDATA) {
        let zones: Zone[] = new Array<Zone>();
        for (let zoneData of superzone.zones) {
            let z: Zone = zoneFromJSON(zoneData, id++, superzone.name,
                zoneLevels[zoneData.name] || 0);
            zones.push(z);
        }
        let supz: SuperZone = {
            name: superzone.name,
            zones: zones,
            unlockDescription: `Unlocked at level ${superzone.minLevel}`,
            unlockCondition: (level: number) => level >= superzone.minLevel
        };
        superzones.push(supz);
    }
    return superzones;
}

function setProbabilities(actions: ActionData[]) {
    let freeWeight = 0;
    let reservedWeight = 0;
    for (let a of actions) {
        if (a.prob) {
            reservedWeight += a.prob;
        } else if (a.weight) {
            freeWeight += a.weight;
        } else {
            if (a.bonusLevel) {
                a.weight = Math.pow(10, -a.bonusLevel);
            } else {
                a.weight = 1.0;
            }
            freeWeight += a.weight;
        }
    }
    console.assert(reservedWeight < 1);
    // How much to scale free weights by
    let scaleFactor = (1-reservedWeight) / freeWeight;
    for (let action of actions) {
        if (!action.prob) {
            action.prob = action.weight * scaleFactor;
        }
    }
}

function zoneFromJSON(j: ZoneData, id: number, superzone: string, level: number) : Zone {
    // Is this giving up type safety?
    let z: Zone = new ConcreteZone();
    z.superzone = superzone;
    z.zid = id;
    z.name = j.name;
    z.description = j.description;
    z.difficulty = j.difficulty;
    z.actions = new Array<ZoneAction>();
    console.assert(j.actions.length > 0);
    /** Postcondition: each action in j.actions will have a prob member, and
        they'll sum to 1 **/
    setProbabilities(j.actions);
    for (let a of j.actions) {
        let zam: ZoneAction = zamFromJSON(a, j, leveledZoneDifficulty(j, level));
        z.actions.push(zam);
    }
    return z;
}

function zamFromJSON(
        j: ActionData,
        parentZone: ZoneData,
        surrogateDifficulty?: number) : ZoneAction
{
    let skills: SkillType[] = j.skills instanceof Array ? <SkillType[]>j.skills : [<SkillType>j.skills];
    let delay = parentZone.baseDelay ? parentZone.baseDelay : GLOBALS.defaultBaseZoneDelay;
    // skill ratios
    let skillRatios: {[skillName: string] : number} = j.skillRatios;
    // If none is explicitly provided, default to equal apportionment
    if (!skillRatios) {
        skillRatios = {};
        for (let skill of skills) {
            skillRatios[SkillType[skill]] = 1/skills.length;
        }
    }
    // The difficulty of this action will determine default values for mastery and skill points
    let difficulty = surrogateDifficulty ? surrogateDifficulty : parentZone.difficulty;
    if (j.difficulty) {
        difficulty = j.difficulty(difficulty);
    } else if (j.bonusLevel) {
        // Still experimenting with this
        difficulty = difficulty + Math.ceil(2*j.bonusLevel);
    }

    /** XXX: I feel like I've consistently set difficulties a bit too low, so just
    going to play with a tweak here and see how it feels.
    **/
    difficulty += 2;

    // mastery
    let mastery:number = masteryForDifficulty(difficulty);
    if (j.mastery) {
        mastery = j.mastery(mastery);
    }
    // skill deltas
    let skillGains: {[skill:string]: number} = gainsForDifficulty(difficulty, skills, skillRatios);
    if (j.bonusLevel && !j.gains) {
        j.gains = multiplicativeOverride(Math.pow(10, j.bonusLevel));
    }
    if (j.gains) {
        for (let skill in skillGains) {
            skillGains[skill] = j.gains(skillGains[skill]);
        }
    }

    return new VerbalZoneAction(
        verbLookup(j.vb),
        j.obj,
        j.opts,
        dictToSkillMap(skillGains),
        j.prob,
        delay,
        mastery,
        j.unlocks,
        j.oneShot
    );
}

function masteryForDifficulty(diff: number) : number {
    // (maybe rounding should happen upstream?)
    return Math.ceil(XpFormulas.benchmarkSkillLevelForPlevel(diff));
}

function gainsForDifficulty(diff: number,
                            skills: SkillType[],
                            skillRatios: {[skill:string] : number}
                        ) : {[skill:string]: number} {
    // The more skills an action involves, the more total skill points it should
    // award (for a given difficulty). But the skill points awarded per skill should
    // decrease monotonically as #skills increases.
    //
    // For now, let's say that the total skill gain is multiplied by .5 + (.5 * #skills)
    let baseSP = XpFormulas.standardSpServing(diff);
    let totalSP = baseSP * (.5 + .5*(skills.length));
    let gains: {[skill:string]: number} = {};
    for (let skillName in skillRatios) {
        gains[skillName] = totalSP * skillRatios[skillName];
    }
    return gains;
}
