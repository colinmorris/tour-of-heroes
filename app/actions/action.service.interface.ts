import { LiveZoneAction, ProtoActionOutcome } from '../core/index';
import { Observable } from 'rxjs/Observable';

export interface IActionService {
    currentAction: LiveZoneAction;
    actionSpeedMultiplier: number;
    protoActionOutcomeSubject: Observable<ProtoActionOutcome>;
}
