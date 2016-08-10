// We're really trying this, huh?

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { GLOBALS } from '../globals';
import { PlayerService } from '../player/player.service';
import { Zone,
    ActionOutcome,
    LiveZoneAction,
    ZoneAction,
    ZoneActionDescription,
    PlayerOutcome,
    ActionEvent,
    ActionEffect } from '../core/index';
import { RealLiveZoneAction } from './reallivezoneaction';

export interface PostActionInfo {
    outcome: ActionOutcome;
    nextAction: LiveZoneAction;
}

@Injectable()
export class ActionService {

    private currentAction: RealLiveZoneAction;
    private activeZone: Zone;
    private postActionWatcher: Observer<PostActionInfo>;

    constructor(
        private PS: PlayerService
    ) { }

    // ------------------- ACTION BOOKKEEPING --------------------------

    /** Immediately terminate any action running in this zone, and stop
    looping actions for that zone. **/
    stopActionLoop(zone: Zone) {
        // TODO: would be cool to define a decorator that says "this is
        // a no-op if there's no actions going on right now"
        if (!this.activeZone) { return; }
        if (this.postActionWatcher) {
            this.postActionWatcher.complete();
            this.postActionWatcher = undefined;
        }
        this.activeZone = undefined;
        this.currentAction.kill();
        this.currentAction = undefined;
    }
    stopAllActions() {
        this.stopActionLoop(this.activeZone);
    }

    observableForZone(zone: Zone) : Observable<PostActionInfo> {
        console.assert(zone == this.activeZone);
        return Observable.create( (observer: Observer<PostActionInfo>) => {
            this.postActionWatcher = observer;
            // unsubscribe function
            return () => { this.postActionWatcher = undefined; };
        });
    }

    ongoingActionForZone(zone: Zone) : LiveZoneAction {
        if (this.activeZone && zone.zid == this.activeZone.zid) {
            return this.currentAction;
        }
        return undefined;
    }

    startActionLoop(zone: Zone) : LiveZoneAction {
        this.stopAllActions();
        this.activeZone = zone;
        this.currentAction = this.runActionLoop();
        return this.currentAction;
    }

    private runActionLoop() : RealLiveZoneAction {
        let zoneaction: ZoneAction = this.chooseActionType(this.activeZone);
        let desc: ZoneActionDescription = zoneaction.chooseDescription();
        let delay = this.getDelay(zoneaction);
        let cb = () => {
            let outcome = this.getOutcome(zoneaction, desc.past); // bleh
            let nextAction = this.runActionLoop();
            let post = { outcome: outcome, nextAction: nextAction };
            if (this.postActionWatcher) {
                this.postActionWatcher.next(post);
            }
        };
        let action: RealLiveZoneAction = new RealLiveZoneAction(
            desc.present, delay, cb);
        this.currentAction = action;
        return action;
    }

    // ------------------- ACTION MECHANICS --------------------------

    private getDelay(action: ZoneAction) {
        return 2000; // TODO
    }

    private getOutcome(action: ZoneAction, mainDesc: string): ActionOutcome {
        let mainEffect: ActionEffect = { skillPoints: action.skillDeltas };
        let mainOutcome: PlayerOutcome = this.PS.applyEffect(mainEffect);
        let mainEvent: ActionEvent = {description: mainDesc, outcome: mainOutcome};
        return {main: mainEvent, secondary:[]};
    }

    // Stuff that used to be a method of zone, and now feels kind of weird here
    private chooseActionType(zone: Zone) : ZoneAction {
        let dice: number = Math.random();
        let sofar = 0;
        for (let action of zone.actions) {
            sofar += action.weight;
            if (sofar > dice) {
                return action;
            }
        }
        console.assert(false, "Shouldnt have reached here.");
    }

}
