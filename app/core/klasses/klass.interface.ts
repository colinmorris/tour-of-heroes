import { SkillMap } from '../skills/index';
import { IStatsService } from '../../stats/stats.service.interface';

type UnlockCriteria = (stats: IStatsService) => boolean;

export interface Klass {
    name: string;
    aptitudes: SkillMap;
    criteria: UnlockCriteria;
}
