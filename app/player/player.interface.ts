import { Skill, RawSkill } from './skill.interface';
import { Progressive } from '../shared/progressive.interface';

export interface RawPlayer {
    name: string;
    klass: string;
    level: number;
    skills: RawSkill[];
}

export interface Player extends RawPlayer, Progressive {
    skills: Skill[];
}
