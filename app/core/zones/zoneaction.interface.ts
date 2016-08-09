import { Verb } from './verb';
import { SkillMap } from '../skills/index';

export interface ZoneAction {
    vb: Verb,
    obj: string,
    opts: string[],
    /** skillDeltas = how many (base) skill points will I gain in each skill upon
     * completing this action? */
    skillDeltas: SkillMap,
    weight: number,
    minDelay: number,
    // Your skill levels must be at least this high to avoid an 'inexperience penalty'
    mastery: number
}
