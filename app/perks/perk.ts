import { Injector, OpaqueToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPerkService } from './perk.service.interface';
import { di_tokens } from '../shared/di-tokens';
import { InjectedArgs } from '../core/index';
import { Bonus, Spell, Buff, Passive, TimedBuff } from './perk.interface';

// TODO: This file needs to be split up.
// also moved to core?

export abstract class AbstractBonus extends InjectedArgs implements Bonus {
    name: string;
    description: string;
}

export abstract class AbstractSpell extends AbstractBonus implements Spell {
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
        let args = this.injectionArgs();
        let success = this.onCast(...args);
        if (success) {
            this.goOnCooldown();
        }
        return success;
    }

    abstract onCast(...services:any[]) : boolean;

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
    onCast(PS: IPerkService) {
        // You are treading on extremely fucking thin ice here. Have to be super
        // careful about not introducing circular dependencies/infinite loops.
        PS.addBuff(this.buffName, this.buffDuration);
        return true;
    }
}

export abstract class AbstractBuff extends AbstractBonus implements Buff {
    abstract apply() : Promise<void>;
    // Called when this buff expires
    abstract cleanUp(...services: any[]);
}

export abstract class AbstractTimedBuff extends AbstractBuff implements TimedBuff {
    duration: number;
    remainingTime = 0;
    private timeCheckInterval = 1000;
    private sub:any;
    apply() : Promise<void> {
        let promise = new Promise<void>( (resolve, reject) => {
            let args = this.injectionArgs();
            this.remainingTime = this.duration * 1000;
            this.onCast(...args);
            // TODO: this pattern is pretty common. Would be nice to refactor it.
            // TODO: Should probably use the take operator too
            this.sub = Observable.interval(this.timeCheckInterval).subscribe( () => {
                this.remainingTime = Math.max(0, this.remainingTime - this.timeCheckInterval);
                if (this.remainingTime == 0) {
                    this.sub.unsubscribe();
                    this.cleanUp(...args);
                    resolve();
                }
            });
        });
        return promise;
    }
    abstract onCast(...services: any[]);
}

export abstract class AbstractPassive extends AbstractBonus implements Passive {
    apply() {
        let args = this.injectionArgs();
        this.onCast(...args);
    }
    abstract onCast(...services: any[]);
}
