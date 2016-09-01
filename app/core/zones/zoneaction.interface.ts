import { SkillMap, SkillType } from '../skills/index';
import { OneShotAction } from './action-oneshots.enum';
import { NamedUnlock } from '../stats/index';
import { Player } from '../../player/player.interface';

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
    minDelay: number; // TODO: not currently used
    // Your skill levels must be at least this high to avoid an 'inexperience penalty'
    // TODO: Does it make sense to expose this as part of the interface? Prolly not.
    mastery: number;
    unlocks?: NamedUnlock;
    oneshot?: OneShotAction;

    // Possibly not idempotent because of randomness
    chooseDescription() : ZoneActionDescription;
    //delay(skills: SkillMap) : ActionDelay;
    /** The below 2 methods return a number in [0, inf) representing fraction
    of base delay added **/
    slowdown(player: Player) : number;
    inexperiencePenaltyForSkill(skill: SkillType, player: Player) : number;
}
