import { SkillMap, SkillType } from '../core/index';
import { Observable } from 'rxjs/Observable';

import { Player } from './player.interface';

export interface IPlayerService {
    player: Player;

    playerLevel$: Observable<number>;

    getBaseAptitudes(): SkillMap;

    buffAptitudes(by: SkillMap);
    /** Convenience method. "Buffs" by the negative of the given values. **/
    debuffAptitudes(by: SkillMap);
    buffSkillLevels(by: SkillMap);
    buffSkillLevel(skill: SkillType, by: number);

    trainSkill(skill: SkillType, basePoints: number);
}
