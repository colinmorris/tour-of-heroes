import { SkillMap } from '../core/index';
import { Observable } from 'rxjs/Observable';

export interface IPlayerService {

    playerLevel$: Observable<number>;

    getBaseAptitudes(): SkillMap;

    buffAptitudes(by: SkillMap);
}
