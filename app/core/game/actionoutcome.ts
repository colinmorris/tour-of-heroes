import { SkillMap } from '../skills/index';

export interface LiveZoneAction {
    description: string;
    pctProgress: number;

    /** TODO: attributes to be added later
    inexperiencePenalty: number;
    remainingTime: number;
    */
}

export interface ActionOutcome {
    main: GameEvent;
    secondary: GameEvent[];
}

export interface GameEvent {
    description: string;
}

export interface PlayerEffect {
    pointsGained: SkillMap;
    levelsGained: number;
}
