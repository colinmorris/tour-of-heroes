import { AbstractSpell, AbstractBuffingSpell } from '../perk';
import { LiveZoneAction, ProtoActionOutcome } from '../../core/index';
import { di_tokens } from '../../shared/di-tokens';
import { IActionService } from '../../actions/action.service.interface';

// Helpers to save some keystrokes
abstract class ActionServiceSpell extends AbstractSpell {
    diTokens = [di_tokens.actionservice];
}

abstract class CurrentActionSpell extends AbstractSpell {
    diTokens = [di_tokens.actionservice];
    onCast(AS: IActionService) : boolean {
        let action: LiveZoneAction = AS.currentAction;
        if (!action || !action.active) {
            return false;
        }
        return this.actionEffect(action);
    }
    abstract actionEffect(action: LiveZoneAction) : boolean;
}

export namespace SPELLS {

export class AssassinPerk extends ActionServiceSpell {
    cooldown = 60;
    static sname = "Execute";
    private completionThreshold = 50;
    static sdescription = `Instantly complete the current action if it's more than 50% complete.`;

    onCast(AS: IActionService) : boolean {
        let action: LiveZoneAction = AS.currentAction;
        if (!action || action.pctProgress < this.completionThreshold) {
            return false;
        }
        action.completeEarly();
        return true;
    }
}

export class ShamanPerk extends CurrentActionSpell {
    cooldown = 60;
    static sname = "Meditate";
    static spMultiplier = 1.0;
    static sdescription = `Increase the SP gained from the current action by 100%`;

    actionEffect(action: LiveZoneAction) : boolean {
        action.spMultiplier += ShamanPerk.spMultiplier;
        return true;
    }
}

export class BerserkerPerk extends AbstractBuffingSpell {
    cooldown = 60;
    static sname = "Berserk";
    static sdescription = `Go berserk, doubling action speed for a short time`;
    buffName = "GoingBerserk";
    buffDuration = 20;
}

/** TODO XXX: Haha, I accidentally wrote the same spell twice. I guess the Shaman
    one wins, since it's a lot more parsimonious. **/
export class ScholarPerk extends AbstractSpell {
    static sname = "Concentrate";
    cooldown = 60;
    static spMultiplier = 3.0;
    static sdescription = `Increase the SP gains from the current action by
        ${100*(1+ScholarPerk.spMultiplier)}%`;
    diTokens = [di_tokens.actionservice];
    onCast(AS: IActionService) {
        let action: LiveZoneAction = AS.currentAction;
        if (!action || !action.active) {
            return false;
        }
        AS.protoActionOutcomeSubject.take(1).subscribe( (proto: ProtoActionOutcome) => {
            proto.spMultiplier += ScholarPerk.spMultiplier;
        });
        return true;
    }
}

}
