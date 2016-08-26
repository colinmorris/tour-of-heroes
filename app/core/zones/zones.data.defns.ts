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
    // Default action delay for this zone. May be modified by delayx on a particular action.
    baseDelay?: number;
    // Integer in range 0-9. This is used to set some reasonable default values for
    // mastery levels and SP gains (which can be overriden per zone/action)
    difficulty: number;
}

export interface ActionData {
    vb: string;
    obj?: string;
    opts?: string[];
    // Which skills does this action train? (Second type option is a convenience,
    // equivalent to an array of length 1)
    skills: SkillType[] | SkillType;
    // Amount of "probability weight" associated with this action (weights of all
    // a zone's actions don't need to add to 1 though - they get normalized)
    // If none is specified, one will be provided for you, according to some undefined method.
    weight?: number;
    // Like above, but represents an absolute probability.
    prob?: number;
    // TODO: Originally, there was an option to override delay. I'm not convinced
    // that that extra degree of freedom is necessary, but may want to consider
    // reviving it later.

    mastery?: Override;
    // Second type option is a convenience - if given, that override will apply
    // to all (non-zero) skill point gains
    //gainz?: {[skillName: string] : Override} | Override;

    // let's wait to complicate it until it's necessary
    gains? : Override;


    // Sets mastery levels and SP gains for this action according to the given
    // difficulty rather than the difficulty of the containing zone. Above overrides
    // are applied after, if present. (If a number type is passed, this is treated
    // as a staticOverride.
    difficulty?: Override | number;
    // By default, skill point gains are equal across this.skills. If you don't want
    // that, specify the apportionment here. Value should sum to 1.
    skillRatios?: {[skillName: string] : number};

    // TODO
    bonusLevel?: number;
}

// TODO: I wish I'd made a firm decision on whether to capitalize the 'z' :(
export interface SuperZoneData {
    name: string;
    minLevel: number;
    zones: ZoneData[];
}
