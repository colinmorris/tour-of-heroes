import { SkillMap } from '../skills/index';
import { IStatsService } from '../../stats/stats.service.interface';

/** A number will be treated as relative progress towards unlocking. .5 means
halfway there, anything >= 1 means yes-unlocked.
**/
type UnlockCriteria = (stats: IStatsService) => (boolean | number);

export interface Klass {
    name: string;
    aptitudes: SkillMap;
    criteria: UnlockCriteria;
    img: string;
}
