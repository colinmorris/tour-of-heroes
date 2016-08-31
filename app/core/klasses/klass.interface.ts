import { SkillMap } from '../skills/index';
import { IStatsService } from '../../stats/stats.service.interface';
import { IPlayerService } from '../../player/player.service.interface';

/** A number will be treated as relative progress towards unlocking. .5 means
halfway there, anything >= 1 means yes-unlocked.
**/
export type UnlockCriteria = (stats: IStatsService, ps: IPlayerService) => (boolean | number);

export interface Klass {
    name: string;
    aptitudes: SkillMap;
    /** A hint at the unlock criteria
        I'm going to try to keep them mostly pretty straightforward. Because
        bad riddles are annoying, and if someone really wants to know, they
        can just read the source. (Hi!)
    **/
    hint: string;
    criteria: UnlockCriteria;
    img: string;
}
