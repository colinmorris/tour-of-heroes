import { SkillType } from './skill';

export class GameZone {
    constructor(
        public name: string,
        public description: string,
        public action: string,
        public skillTrainingWeights: number[]
    ) {}

    // Unlock req'ts...
}

