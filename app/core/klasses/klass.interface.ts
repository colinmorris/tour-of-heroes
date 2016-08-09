import { SkillMap } from '../skills/index';
import { LifetimeStats } from '../stats/index';

type UnlockCriteria = (stats: LifetimeStats) => boolean;

export interface Klass {
    name: string;
    aptitudes: SkillMap;
    criteria: UnlockCriteria;
}
