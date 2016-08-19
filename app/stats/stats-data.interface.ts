import { SkillMap } from '../core/index';

export interface StatCell {
    current: number;
    sum: number;
}

export interface StatsData {
    simpleStats : StatCell[];
    unlocks: boolean[];
    // Map from klass to name to max plvl attained
    klassLevels: {[klass:string] : number};
    // This seems... silly
    skillLevels: SkillMap;
    actionStats: {[zone: string] : StatCell};
}
