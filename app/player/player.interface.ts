import { Skill } from './skill.interface';
import { Progressive } from '../shared/progressive.interface';

export interface Player extends Progressive {
    name: string;
    klass: string;
    level: number;
    skills: Skill[];
}
