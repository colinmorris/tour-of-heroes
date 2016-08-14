import { Progressive } from '../shared/progressive.interface';

export interface Skill extends Progressive {
    name: string;

    baseLevel: number;
    level: number;

    baseAptitude: number;
    aptitude: number;

    points: number;
    pointsForNextLevel: number;
}
