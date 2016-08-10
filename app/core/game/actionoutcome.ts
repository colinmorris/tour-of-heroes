import { SkillMap } from '../skills/index';
// TODO: This definitely needs to move to core. Violation of organizing principles.
import { Item } from '../../items/item';

// TODO: these should probably be split out into separate files

// TODO: Some naming ambiguity/confusion here. Maybe this should be called CompletedAction
// or something? Wait until dust settles to worry about this.
export interface ActionOutcome {
    main: ActionEvent;
    secondary: ActionEvent[];
}

export interface ActionEvent {
    // (The description should hold some flavour information, not just
    // describe the outcome. e.g. outcome="book of X added to inventory",
    // description="you sneak a book out of the library when no-one's looking")
    description: string;
    outcome: PlayerOutcome;
}

export interface ActionEffect extends PlayerEffect {
    skillPoints?: SkillMap;
    item?: Item;
}

// Maybe this should really be a union? Also, maybe this is over-generalized?
export interface PlayerEffect {
    skillPoints?: SkillMap;
    item?: Item;
    // Might be extended later to include buffs, etc.
}

export interface PlayerOutcome {
    pointsGained?: SkillMap;
}
