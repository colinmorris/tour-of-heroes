/* First 5 perks to implement:
- peasant: double apts until lvl 10
- berserker: active skill to double action speed for 30 seconds
- priest: active skill to double gains of next (/ ongoing) action
- student: chance for any non-intellect action to train intellect
- ranger: double skill gains in woods
- warrior: "execute" instantly complete an action that's more than 50% through
*/

import { Injector, OpaqueToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { actionToken } from '../globals';

// Have to be careful about circular references here.
//import { ActionService } from '../actions/action.service';
declare class ActionService {
    currentAction: LiveZoneAction;
}
import { LiveZoneAction, ActionEffect } from '../core/index';


// TODO: Considr a pctProgress mixin?
export interface Spell {
    name: string;
    description: string;
    cooldown: number;
    remainingCooldown: number;
}

abstract class AbstractSpell implements Spell {
    name: string;
    description: string;
    cooldown: number;
    remainingCooldown = 0;
    private cooldownCheckInterval = 1000;
    private sub: any;
    get cooldown_ms() { return this.cooldown * 1000; }

    abstract tryCast() : boolean;
    protected cast() : boolean {
        if (this.remainingCooldown > 0) {
            console.log(`Can't cast ${this.name}. Still on cooldown`);
            return false;
        }
        let success = this.tryCast();
        if (success) {
            this.goOnCooldown();
        }
        return success;
    }
    protected goOnCooldown() {
        this.remainingCooldown = this.cooldown_ms;
        let cooldownTimer = Observable.interval(this.cooldownCheckInterval);
        this.sub = cooldownTimer.subscribe( (i: number) => {
            this.remainingCooldown = Math.max(0,
                this.remainingCooldown-this.cooldownCheckInterval);
            if (this.remainingCooldown == 0) {
                this.sub.unsubscribe();
            }
        });
    }
}

abstract class InjectorSpell extends AbstractSpell {
    constructor(
        protected injector: Injector
    ) {
        super();
    }

}

abstract class ActionSpell extends InjectorSpell {
    tryCast() : boolean {
        let AS: ActionService = this.injector.get(actionToken);
        return this.castEffect(AS);
    }

    abstract castEffect(AS: ActionService) : boolean;
}

export class Execute extends ActionSpell {
    cooldown = 60;
    name = "Execute";
    description = "Blah blah blah";

    private completionThreshold = 50;
    castEffect(AS: ActionService) : boolean {
        let action: LiveZoneAction = AS.currentAction;
        if (!action || action.pctProgress < this.completionThreshold) {
            return false;
        }
        action.completeEarly();
        return true;
    }
}
