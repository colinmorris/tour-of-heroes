import { SkillType } from '../core/index';

export enum Stat {
    PlayerLevel, // klass
    ItemsFound, // (klass, zone,)
    SpellsCast, // (klass,)
    Clicks, // (klass)
    SkillLevel, // skill (basically obligatory)
    ActionsTaken, // zone
    MAX
}

export enum NamedUnlock {
    MAX
}

export interface IStatsService {
    current(s: Stat) : number;
    lifetimeSum(s: Stat) : number;
    unlocked(u: NamedUnlock) : boolean;

    playerLevel(klass: string) : number;
    maxLevelPerKlass() : {[klass:string] : number};
    skillLevel(skill: SkillType) : number;

    actionsTaken(zone: string) : number;
    lifetimeSumActionsTaken(zone: string) : number;
}

/** For 'counter' stats, there are a few questions it makes sense to ask:
- value in this lifetime
- max value across lifetimes
- sum across lifetimes (this one probably isn't super meaningful for some stats
    like player level or skill level)
**/
