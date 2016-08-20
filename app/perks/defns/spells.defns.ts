import { AbstractSpell, AbstractBuffingSpell } from '../perk';
import { LiveZoneAction } from '../../core/index';
import { di_tokens } from '../../shared/di-tokens';
import { IActionService } from '../../actions/action.service.interface';

// Helpers to save some keystrokes
abstract class ActionServiceSpell extends AbstractSpell {
    diTokens = [di_tokens.actionservice];
}

export namespace SPELLS {

export class Execute extends ActionServiceSpell {
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

export class Berserk extends AbstractBuffingSpell {
    cooldown = 60;
    name = "Berserk";
    description = "get mad";
    buffName = "GoingBerserk";
    buffDuration = 20;
}

}
