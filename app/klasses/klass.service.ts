import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { NotificationsService } from 'angular2-notifications';

import { SkillMap, Klass, KLASSES } from '../core/index';
import { StatsService } from '../stats/stats.service';

export interface LiveKlass extends Klass {
    unlocked: boolean;
    progress?: number; // % progress to unlocking - only set if unlocked is false
}

@Injectable()
export class KlassService {

    starterKlass = "Peasant";
    private klassMap : {[name:string] : LiveKlass};
    private unlockCheckInterval = 5 * 1000;

    constructor(
        private stats: StatsService,
        private Toasts: NotificationsService
    ) {
        this.klassMap = <{[name:string] : LiveKlass}>{};
        for (let klass of KLASSES) {
            let k: LiveKlass = klass as LiveKlass;
            k.unlocked = stats.classUnlocked(k.name);
            this.klassMap[klass.name] = k;
        }
        // Set up unlock checks
        Observable.timer(0, this.unlockCheckInterval).subscribe( () => {
            this.checkUnlocks();
        });
    }

    get allKlasses() : LiveKlass[] {
        let klasses: LiveKlass[] = new Array<LiveKlass>();
        for (let name in this.klassMap) {
            klasses.push(this.klassMap[name]);
        }
        return klasses;
    }

    private checkUnlocks() {
        console.log("Checking for unlocks");
        for (let k of KLASSES) {
            let klass: LiveKlass = this.klassMap[k.name];
            if (klass.unlocked) {
                /** It's possible that the unlocked flag was set before the
                unlock requirements changed, and that the player shouldn't
                actually have this class unlocked in their current state.
                But let's just give it to them anyways.
                **/
                continue;
            }
            let unlockScore = klass.criteria(this.stats);
            var didUnlock: boolean;
            if (typeof unlockScore == 'number') {
                if (isNaN(<number>unlockScore)) {
                    console.warn("Got score of NaN for " + klass.name);
                    unlockScore = 0;
                }
                klass.progress = <number>unlockScore;
                didUnlock = (<number>unlockScore) >= 1;
            } else {
                didUnlock = <boolean>unlockScore;
            }
            if (didUnlock) {
                console.log(`Wow!! Unlocked ${klass.name}`);
                this.stats.setClassUnlocked(klass.name);
                this.klassUnlockToast(klass);
                klass.progress = undefined;
            }
            klass.unlocked = didUnlock;
        }
    }

    private klassUnlockToast(klass: LiveKlass) {
        // this seems like overkill, but...
        /** TODO: icons are a little small. Would be good to define some
        global style rules for mini/medium/big class icons. **/
        let html = `<div class="row">
        <div class="col-xs-4">
        <img src="/assets/units/${klass.img}">
        </div>
        <div class="col-cs-8">
        <p>New class unlocked!</p>
        <h3 class="toast-klassname">${klass.name}</h3>
        </div>
        </div>
        `;
        this.Toasts.html(html, "success");
    }

    aptitudesForKlass(klass: string) : SkillMap {
        return this.klassMap[klass].aptitudes;
    }

    iconForKlass(klass: string) : string {
        return '/assets/units/' + this.klassMap[klass].img;
    }

}
