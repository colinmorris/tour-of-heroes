import { SkillMap } from '../skills/index';

export interface ZoneActionDescription {
    present: string;
    past: string;
}

export interface ZoneAction {
    skillDeltas: SkillMap;
    weight: number;
    minDelay: number;
    // Your skill levels must be at least this high to avoid an 'inexperience penalty'
    mastery: number;

    // Possibly not idempotent because of randomness
    chooseDescription() : ZoneActionDescription;
}
