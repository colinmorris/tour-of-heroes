import { Progressive } from '../shared/progressive.interface';

/** A skill without any buff information. This is the currency of
 * serialization **/
export interface RawSkill {
    id: number;
    name: string;
    baseAptitude: number;
    points: number;
}

export interface Skill extends RawSkill, Progressive {
    baseLevel: number;
    level: number;
    aptitude: number;
    pointsForNextLevel: number;
}
