import { SkillType } from '../skills/index';

export interface LifetimeStats {

    actionsTaken : number;
    maxSkillLevel(skill: SkillType) : number;

}
