import { LifetimeStats } from './stats';
import { SkillMap } from './skill';

// 1 -> unlocked, but can take values from (0,1) to show relative progress
// Actually meh
export type Unlocked = boolean | number;
export type UnlockReq = (stats: LifetimeStats) => Unlocked;

export class Klass { 

    constructor(
        public name: string,
        public aptitudes: SkillMap,
        public criteria: UnlockReq
    ) {}
}


