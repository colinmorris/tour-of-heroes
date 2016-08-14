import { LiveZoneAction } from '../core/index';

export interface IActionService {
    currentAction: LiveZoneAction;
    actionSpeedMultiplier: number;
}
