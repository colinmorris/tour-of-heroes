import { SkillType, Stat, NamedUnlock } from '../core/index';

export interface IStatsService {
    // TODO: clarify semantix
    current(s: Stat) : number;
    lifetimeSum(s: Stat) : number;
    classUnlocked(klass: string) : boolean;
    unlocked(u: NamedUnlock) : boolean;

    playerLevel(klass: string) : number;
    maxLevelPerKlass() : {[klass:string] : number};
    /** Essentially maxLevelPerKlass().values() (if javascript were a sane
        language and therefore had such a method) **/
    maxLevels() : number[];
    skillLevel(skill: SkillType) : number;

    // TODO: Would be nice if this were not stringly typed :(
    actionsTaken(zone: string) : number;
    lifetimeSumActionsTaken(zone: string) : number;
}
