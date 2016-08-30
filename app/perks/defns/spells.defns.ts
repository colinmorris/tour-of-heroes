import { AbstractSpell, AbstractBuffingSpell } from '../perk';
import { LiveZoneAction, ProtoActionOutcome,
    randomSkill, SkillType,
    XpFormulas
 } from '../../core/index';
import { di_tokens } from '../../shared/di-tokens';
import { IActionService } from '../../actions/action.service.interface';
import { IPlayerService } from '../../player/player.service.interface';

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

export class ScholarPerk extends AbstractSpell {
    static sname = "Research";
    cooldown = 300;
    static sdescription = `Instantly gain a large number of skill points in a random skill`;
    diTokens = [di_tokens.playerservice];
    onCast(PS: IPlayerService) {
        let skill: SkillType = randomSkill();
        let standard = XpFormulas.standardSpServingForSkillLevel(
            PS.player.skills[skill].baseLevel
        );
        /** Let's make it nice and swingy. Anywhere between 1 standard serving
        to 32 times **/
        let exponent = Math.random() * 5;
        let sp = Math.pow(2, exponent) * standard;
        console.log(`Research spell training ${SkillType[skill]} by ${sp} points
            standard=${standard}, exponent=${exponent}`);
        PS.trainSkill(skill, sp);
        return true;
    }
}

}
