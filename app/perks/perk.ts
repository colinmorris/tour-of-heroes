import { Injector, OpaqueToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPerkService } from './perk.service.interface';
import { di_tokens } from '../shared/di-tokens';
import { Castable, AbstractCastable } from '../core/index';
import { Bonus, Spell, Buff, Passive, TimedBuff } from './perk.interface';

// TODO: This file needs to be split up.

export abstract class AbstractBonus<T> extends AbstractCastable<T> implements Bonus {
    name: string;
    description: string;
}

export abstract class AbstractSpell extends AbstractBonus<boolean> implements Spell {
    /** Unlike buffs/passives, spells aren't cast the instant they're 'added',
    so we need to store a reference to an injector at the time the service
    instantiates it. **/
    injector: Injector;
    cooldown: number;
    get cooldownMs() { return 1000 * this.cooldown; }
    remainingCooldown: number;

    private sub: any;
    private cooldownCheckInterval = 1000;

    /** Return success/failure **/
    cast() : boolean {
        if (this.remainingCooldown > 0) {
            console.log(`Can't cast ${this.name}. Still on cooldown`);
            return false;
        }
        let success = this.injectiveCast(this.injector);
        if (success) {
            this.goOnCooldown();
        }
        return success;
    }

    goOnCooldown() {
        this.remainingCooldown = this.cooldownMs;
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

export abstract class AbstractBuffingSpell extends AbstractSpell {
    buffName: string;
    buffDuration: number = undefined;
    diTokens = [di_tokens.perkservice];
    injectiveCast(injector: Injector) {
        // You are treading on extremely fucking thin ice here. Have to be super
        // careful about not introducing circular dependencies/infinite loops.
        let PS: IPerkService = injector.get(di_tokens.perkservice);
        PS.addBuff(this.buffName, this.buffDuration);
        return true;
    }
}

export abstract class AbstractBuff extends AbstractBonus<Promise<void>> implements Buff {
    // Called when this buff expires
    abstract cleanUp(...services: any[]);
}

export abstract class AbstractTimedBuff extends AbstractBuff implements TimedBuff {
    duration: number;
    remainingTime = 0;
    private timeCheckInterval = 1000;
    wrapcast(injector: Injector) : Promise<void> {
        let args = this.injectionArgs(injector);
        let promise = new Promise<void>( (resolve, reject) => {
            this.onCast(args);
            Observable.interval(this.timeCheckInterval).subscribe( () => {
                this.cleanUp(args);
                resolve();
            });
        });
        return promise;
    }
}

export abstract class AbstractPassive extends AbstractBonus<void> implements Passive {

}
