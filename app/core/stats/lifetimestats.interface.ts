import { SkillType } from '../skills/index';

// XXX: Deprecated
export interface LifetimeStats {

    actionsTaken : number;
    maxSkillLevel(skill: SkillType) : number;

}
