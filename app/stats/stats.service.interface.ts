import { SkillType, Stat, NamedUnlock } from '../core/index';

export interface IStatsService {
    // TODO: clarify semantix
    current(s: Stat) : number;
    lifetimeSum(s: Stat) : number;
    unlocked(u: NamedUnlock) : boolean;

    playerLevel(klass: string) : number;
    maxLevelPerKlass() : {[klass:string] : number};
    skillLevel(skill: SkillType) : number;

    actionsTaken(zone: string) : number;
    lifetimeSumActionsTaken(zone: string) : number;
}
