import { AbstractSpell, AbstractBuffingSpell } from '../perk';
import { LiveZoneAction, ProtoActionOutcome } from '../../core/index';
import { di_tokens } from '../../shared/di-tokens';
import { IActionService } from '../../actions/action.service.interface';

// Helpers to save some keystrokes
abstract class ActionServiceSpell extends AbstractSpell {
    diTokens = [di_tokens.actionservice];
}

export namespace SPELLS {

export class AssassinPerk extends ActionServiceSpell {
    cooldown = 60;
    name = "Execute";
    description = "Blah blah blah";

    private completionThreshold = 50;
    onCast(AS: IActionService) : boolean {
        let action: LiveZoneAction = AS.currentAction;
        if (!action || action.pctProgress < this.completionThreshold) {
            return false;
        }
        action.completeEarly();
        return true;
    }
}

export class BerserkerPerk extends AbstractBuffingSpell {
    cooldown = 60;
    name = "Berserk";
    description = "get mad";
    buffName = "GoingBerserk";
    buffDuration = 20;
}

export class ScholarPerk extends AbstractSpell {
    name = "Concentrate";
    cooldown = 60;
    private spMultiplier = 3.0;
    description = `Increase the SP gains from the current action by
        ${100*(1+this.spMultiplier)}%`;
    diTokens = [di_tokens.actionservice];
    onCast(AS: IActionService) {
        let action: LiveZoneAction = AS.currentAction;
        if (!action || !action.active) {
            return false;
        }
        AS.protoActionOutcomeSubject.take(1).subscribe( (proto: ProtoActionOutcome) => {
            proto.spMultiplier += this.spMultiplier;
        });
        return true;
    }
}

}
