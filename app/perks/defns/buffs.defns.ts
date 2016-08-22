import { Injector } from '@angular/core';

import { AbstractBuff, AbstractTimedBuff } from '../perk';
import { di_tokens } from '../../shared/di-tokens';
import { IActionService } from '../../actions/action.service.interface';
import { IPlayerService } from '../../player/player.service.interface';
import { SkillType } from '../../core/index';

export namespace BUFFS {

export class GoingBerserk extends AbstractTimedBuff {
    diTokens = [di_tokens.actionservice];
    name = "Berserk";
    private speedup = 2.0;
    description = "u mad";
    duration = 20

    onCast(AS: IActionService) {
        console.log("Applying berserking buff");
        AS.actionSpeedMultiplier += this.speedup;
    }

    cleanUp(AS: IActionService) {
        console.log("Removing berserking buff");
        AS.actionSpeedMultiplier -= this.speedup;
    }
}

export class Fruity extends AbstractTimedBuff {
    diTokens = [di_tokens.playerservice];
    constructor(
        injector: Injector,
        private buffedSkill: SkillType
    ) {
        super(injector, buffedSkill);
    }
    static randomFruity(injector: Injector) : Fruity {
        let randomSkill: SkillType = Math.floor(
            Math.random() * SkillType.MAX
        );
        return new Fruity(injector, randomSkill);
    }
    name = "Fruity";
    duration = 120;
    private buffAmt = 5;
    description = "zzz";
    onCast(PS: IPlayerService) {
        // It'd be kind of cool if these buff methods just returned a callback
        // that undid the buff. Could do the same thing e.g. with AS.actionSpeedMultiplier
        PS.buffSkillLevel(this.buffedSkill, this.buffAmt);
    }
    cleanUp(PS: IPlayerService) {
        PS.buffSkillLevel(this.buffedSkill, -this.buffAmt);
    }
}

}
