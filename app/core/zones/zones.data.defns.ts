import { SkillType } from '../skills/index';
import { NamedUnlock } from '../stats/index';
import { OneShotAction } from './action-oneshots.enum';

// defines some useful interfaces for defining zones and actions as (mostly) json files.


export interface Override {
    (dflt: number) : number;
}
export function staticOverride(value: number) : Override {
    return (_) => { return value; };
}
export function multiplicativeOverride(multiplier: number) : Override {
    return (dflt:number) => { return dflt * multiplier; };
}
export function additiveOverride(bias: number) : Override {
    return (dflt:number) => { return dflt + bias; };
}

export interface ZoneData {
    name: string;
    description: string;
    actions: ActionData[];
    // Default action delay for this zone. (In practice not used yet)
    baseDelay?: number;
    /** This is used to set default values for mastery levels and SP gains of
        this zone's actions. When actions do provide overrides, they're pretty
        much always functions of those default values.

        Exists on a scale comparable to player level. e.g. a difficulty score of
        15 means that this zone will be reasonably challenging for a player at
        level 15 (more or less, depending on their particular skill specializations),
        and SP gains will be around the 'standard serving' for level 15.
        (Can go below 1 if you really want)

        TODO: Would be cool to have this be an override wrt superzone difficulty.
        Easier to rejig numbers in the future. But let's set that aside for now.
    **/
    difficulty: number;
}

// TODO: Originally, there was an option to override delay. I'm not convinced
// that that extra degree of freedom is necessary, but may want to consider
// reviving it later.
export interface ActionData {
    vb: string;
    obj?: string;
    opts?: string[];
    // Which skills does this action train? (Second type option is a convenience,
    // equivalent to an array of length 1)
    skills: SkillType[] | SkillType;
    /** Amount of "probability weight" associated with this action (weights of
        all a zone's actions don't need to add to 1 though - they get normalized)
        If none is specified, defaults to 1 (or 1/10^(-bonusLevel) if applicable).

        If none of a zone's actions have weight/prob set, you'll end up with a
        uniform distribution over actions, except bonus actions, which will be
        10%/1%/.1%/... as likely as 'normal' actions depending on how bonus-y
        they are.
    **/
    weight?: number;
    // Like above, but represents an absolute probability.
    prob?: number;

    mastery?: Override;
    // Second type option is a convenience - if given, that override will apply
    // to all (non-zero) skill point gains
    //gainz?: {[skillName: string] : Override} | Override;
    // let's wait to complicate it until it's necessary

    gains? : Override;

    /** Sets mastery levels and SP gains for this action according to the given
        difficulty rather than the difficulty of the containing zone. Above overrides
        are applied after, if present. But it's probably not a good idea to mix
        and match them. **/
    difficulty?: Override;
    /** By default, skill point gains are equal across this.skills. If you don't
        want that, specify the apportionment here. Value should sum to 1.
        Notably this affects SP gains but NOT delay calculations.
    **/
    skillRatios?: {[skillName: string] : number};

    /** Bonus actions appear less often, are slightly more difficult, but have higher
        SP gains (even relative to their difficulty level). Higher 'bonus levels'
        exaggerate all of these traits. Namely, for bonus level b:
        - weight is set to 10^(-b) (unless explicitly specified)
        - difficulty is increased by 1 (should probably scale)
        - SP gains are multiplied by 10^b
    Bonus levels may be fractional - anywhere in the range (0, inf)
    Exercise caution when combining this with other overrides.
    **/
    bonusLevel?: number;

    /** This action unlocks the given thing when completed. (This will usually
    apply to rare actions, which serve to unlock classes). **/
    unlocks?: NamedUnlock;

    /** If set, then this action can only occur once per lifetime.
    **/
    oneShot?: OneShotAction;
}

// TODO: I wish I'd made a firm decision on whether to capitalize the 'z' :(
export interface SuperZoneData {
    name: string;
    minLevel: number;
    zones: ZoneData[];
    // If true, only show this SZ when "cheatMode" is on
    cheat?: boolean;
}
