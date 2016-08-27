import { SkillMap, SkillType } from '../skills/index';
import { NamedUnlock } from '../stats/index';

export interface ZoneActionDescription {
    present: string;
    past: string;
}

export interface ActionDelay {
    base: number;
    inexperiencePenalty: number;
}

export interface ZoneAction {
    skillDeltas: SkillMap;
    weight: number;
    minDelay: number;
    // Your skill levels must be at least this high to avoid an 'inexperience penalty'
    // TODO: Does it make sense to expose this as part of the interface? Prolly not.
    mastery: number;
    unlocks?: NamedUnlock;

    // Possibly not idempotent because of randomness
    chooseDescription() : ZoneActionDescription;
    delay(skills: SkillMap) : ActionDelay;
    // A multiplier in [1, inf)
    inexperiencePenalty(skills: SkillMap) : number;
    inexperiencePenaltyForSkillLevel(skill: SkillType, level: number) : number;
}
