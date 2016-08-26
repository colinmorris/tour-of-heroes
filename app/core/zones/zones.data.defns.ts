import { SkillType } from '../skills/index';

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


// TODO: Consider a generosity/bonus/efficiency option for zones and actions,
// which would apply some standard transformations to mastery and point gains -
// and maybe even to probability weight?
// (as a nice, consistent shortcut for the common use case of 'this is a rare
// 'bonus' action you should be happy to get, or this is a high-quality zone
// that's only available under some limited circumstances)
export interface ZoneData {
    name: string;
    description: string;
    actions: ActionData[];
    // Default action delay for this zone. (In practice not used yet)
    baseDelay?: number;
    // Integer in range 0-9. This is used to set some reasonable default values for
    // mastery levels and SP gains (which can be overriden per zone/action)
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
        and match them.
        If a number type is passed, this is treated as a staticOverride. **/
    difficulty?: Override | number;
    /** By default, skill point gains are equal across this.skills. If you don't
        want that, specify the apportionment here. Value should sum to 1.
        Notably this affects SP gains but NOT delay calculations.
    **/
    skillRatios?: {[skillName: string] : number};

    /** Bonus actions appear less often, are slightly more difficult, but have higher
        SP gains (even relative to their difficulty level). Higher 'bonus levels'
        exaggerate all of these traits. Namely, for bonus level b:
        - weight is set to 10^(-b)
        - difficulty is increased by 1 (should probably scale)
        - SP gains are multiplied by 10^b
    Exercise caution when combining this with other overrides.
    **/
    bonusLevel?: number;
}

// TODO: I wish I'd made a firm decision on whether to capitalize the 'z' :(
export interface SuperZoneData {
    name: string;
    minLevel: number;
    zones: ZoneData[];
}
