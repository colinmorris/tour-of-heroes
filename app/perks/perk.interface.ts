import { Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/** Defines the interfaces exposed outside of the perk definition files and service
(i.e. to the view, and maybe some other services) **/

export interface Bonus {
    name: string;
    description: string;
}

export interface Spell extends Bonus {
    cooldown: number;
    remainingCooldown: number;
    cast() : boolean;
}

export interface Buff extends Bonus {
}

export interface Passive extends Buff {
}

interface TemporaryBuff extends Buff {
}

export interface TimedBuff extends TemporaryBuff {
    duration: number;
    remainingTime: number;
}

/** Let's come up with some clear nomenclature to start.

BONUS: something that modifies the game state (usually in a good way) according
    to some particular rules/conditions. Can modify player stats, action outcomes, etc.

BUFF: a temporary bonus (usually on a timer, but may have some other
    termination condition)

(maybe) ONESHOT: a degenerate buff having duration 0.

PASSIVE: a permanent bonus (at least, permanent wrt the lifetime of the character)
    (should basically be equivalent to a buff with infinite duration)

SPELL: something that can be activated by the player (on some cooldown), which may
    confer a bonus (usually a buff, rarely a perk), or have some other effect (?)

PERK: a passive or spell associated with a particular class

*/
