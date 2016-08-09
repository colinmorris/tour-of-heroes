import { PlayerSkill } from './playerskill';
import { SkillMapOf } from '../skills/index';

export interface Player {
    name: string;
    level: number;
    klass: string;
    skills: SkillMapOf<PlayerSkill>;
}
