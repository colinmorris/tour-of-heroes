import { SkillMap } from '../skills/index';
// TODO: This definitely needs to move to core. Violation of organizing principles.
import { Item } from '../../items/item';
import { ZoneAction } from '../zones/index';

// TODO: these should probably be split out into separate files

// TODO: Some naming ambiguity/confusion here. Maybe this should be called CompletedAction
// or something? Wait until dust settles to worry about this.

export interface ActionOutcome {
    main: SimpleActionEvent;
    // "Kickers" - extra happenings, usually the result of some perk/buff
    secondary: ActionEvent[];
}

export interface ProtoActionOutcome {
    action: ZoneAction;
    kickers: SecondaryAction[];
}

export interface SecondaryAction {
    description: string;
    skillPoints?: SkillMap;
}

export interface ActionEvent {
    // (The description should hold some flavour information, not just
    // describe the outcome. e.g. outcome="book of X added to inventory",
    // description="you sneak a book out of the library when no-one's looking")
    description: string;
    pointsGained?: SkillMap;
}

export interface SimpleActionEvent extends ActionEvent {
    pointsGained: SkillMap;
}
