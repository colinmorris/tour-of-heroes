import { SkillMap } from '../core/index';

export interface StatCell {
    current: number;
    sum: number;
}

export interface StatsData {
    // Indexed by Stat enum
    simpleStats : StatCell[];
    // Indexed by OneShotAction
    oneShots: boolean[];
    // Indexed by NamedUnlock
    unlocks: boolean[];
    klassUnlocks: {[klass:string] : any};
    // Map from klass to name to max plvl attained (recorded upon reincarnation)
    // TODO: Clarify expectations for classes not unlocked/reincarnated from
    klassLevels: {[klass:string] : number};
    // Max level attained per skill
    skillLevels: SkillMap;
    actionStats: {[zone: string] : StatCell};
}
