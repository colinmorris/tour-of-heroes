import { GLOBALS } from '../../globals';

// Return a multiplier in range [1,inf) (where 1 means no bonus)
export function ancestryBonusForLevel(level: number) {
    let thresh = GLOBALS.reincarnationMinLevel;
    if (level < thresh) {
        return 0;
    }
    // Your first level (i.e. level 10 currently) gets you a .5% bonus.
    // Level 13 => 2.5%, Level 18 => 5%,
    // Level 32 => 10%, Level 96 => 20%, 567=> 40%
    // Trying to hit a nice balance between rewarding exploration and concentration
    let loglvl = Math.log(level - (thresh-2));
    return (loglvl * loglvl)/100;
}

// Return a multiplier in range [1,inf) (where 1 means no bonus)
export function ancestryBonus(levels: number[]) {
    let multiplier = 0;
    for (let klassLevel of levels) {
        multiplier += ancestryBonusForLevel(klassLevel);
    }
    return multiplier;
}
