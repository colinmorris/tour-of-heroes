import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { NotificationsService } from 'angular2-notifications';

import { SkillMap, Klass, KLASSES } from '../core/index';
import { StatsService } from '../stats/stats.service';
import { IPlayerService } from '../player/player.service.interface';

export interface LiveKlass extends Klass {
    unlocked: boolean;
    progress?: number; // % progress to unlocking - only set if unlocked is false
}

@Injectable()
export class KlassService {
    /** The class that will show initially in the 'porthole' when navigating
    to the classes view. **/
    public focalKlass : LiveKlass;
    starterKlass = "Peasant";
    private klassMap : {[name:string] : LiveKlass};

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

        this.focalKlass = this.klassMap[this.starterKlass];
    }

    get allKlasses() : LiveKlass[] {
        let klasses: LiveKlass[] = new Array<LiveKlass>();
        for (let name in this.klassMap) {
            klasses.push(this.klassMap[name]);
        }
        return klasses;
    }

    get nKlasses() {
        return KLASSES.length;
    }
    get nUnlocked() {
        let n = 0;
        for (let klassname in this.klassMap) {
            n += this.klassMap[klassname].unlocked ? 1 : 0;
        }
        return n;
    }

    checkUnlocks(PS: IPlayerService) {
        /** TODO: This is too spammy to log. But just cause it's out of sight,
        doesn't mean it's out of mind. Should return to this at some point and
        review perf implications, and whether there's a more elegant way to do
        this.
        **/
        //console.log("Checking for unlocks");
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
            let unlockScore = klass.criteria(this.stats, PS);
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
                if (klass.name != "Peasant") {
                    this.klassUnlockToast(klass);
                }
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
        <img src="assets/units/${klass.img}">
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
        return 'assets/units/' + this.klassMap[klass].img;
    }

}
