import { LifetimeStats } from './stats';
import { SkillMap } from './skill.data';

// 1 -> unlocked, but can take values from (0,1) to show relative progress
// Actually meh
type Unlocked = boolean; 
type UnlockReq = (stats: LifetimeStats) => Unlocked;

export class Klass { 
    unlocked: Unlocked = false;
    constructor(
        public name: string,
        public aptitudes: SkillMap,
        public criteria: UnlockReq
    ) {}
}


