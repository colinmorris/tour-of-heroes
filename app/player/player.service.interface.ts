import { SkillMap, SkillType } from '../core/index';
import { Observable } from 'rxjs/Observable';

export interface IPlayerService {

    playerLevel$: Observable<number>;
    clickMultiplier: number;

    getBaseAptitudes(): SkillMap;

    buffAptitudes(by: SkillMap);
    /** Convenience method. "Buffs" by the negative of the given values. **/
    debuffAptitudes(by: SkillMap);
    buffSkillLevels(by: SkillMap);
    buffSkillLevel(skill: SkillType, by: number);
}
