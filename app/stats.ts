import { SkillMap, SkillType } from './skill';

/** What kinds of stats would one want to keep track of? Basically anything that
 * can be used as unlock criteria for classes (and maybe other unlockables). Namely...
 *  (maxes unless otherwise specified)...
 *
 * - skill level reached per skill
 * - plvl reached per class
 * - actions spent per zone
 * - actions spent per skill
 * - 
 *
 * (Should maybe just fill this in opportunistically as actual unlockables are added?)
 */

export class LifetimeStats {

    // Max level attained per skill
    maxSkillLevel: SkillMap;
}
