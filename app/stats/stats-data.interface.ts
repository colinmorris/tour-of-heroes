import { SkillMap, zeroSkillMap, OneShotAction } from '../core/index';

export interface StatCell {
    current: number;
    sum: number;
}

/** TODO: Turn this into a class like CLtD, and add a method for healing
version mismatches (by at least filling in any gaps for new enum values)
**/
export interface StatsData {
    // Indexed by Stat enum
    simpleStats : StatCell[];
    // Indexed by NamedUnlock
    unlocks: boolean[];
    klassUnlocks: {[klass:string] : any};
    // Map from klass to name to max plvl attained (recorded upon reincarnation)
    // TODO: Clarify expectations for classes not unlocked/reincarnated from
    klassLevels: {[klass:string] : number};
    // Max level attained per skill
    skillLevels: SkillMap;
    actionStats: {[zone: string] : StatCell};
    current: CurrentLifetimeData;
}

/** Data only descriptive of the current lifetime. Reset to a blank slate
    on reincarnation. **/
export class CurrentLifetimeData {
    constructor(
        // Indexed by OneShotAction
        public oneShots: boolean[] = [],
        public skillLevels: SkillMap = zeroSkillMap(),
        public ziTokens: number = 0,
        public zoneLevels: {[name: string]: number} = {}
    ) {
        for (let s = 0; s < OneShotAction.MAX; s++) {
            this.oneShots[s] = false;
        }
    }
}
