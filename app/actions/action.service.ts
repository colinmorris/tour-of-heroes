import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { IActionService } from './action.service.interface';
import { GLOBALS } from '../globals';
import { PlayerService } from '../player/player.service';
import { StatsService } from '../stats/stats.service';
import { Zone,
    ActionOutcome,
    ProtoActionOutcome,
    SecondaryAction,
    LiveZoneAction,
    ZoneAction,
    ZoneActionDescription,
    ActionEvent,
    SkillMap, getTruthySkills
 } from '../core/index';
import { RealLiveZoneAction } from './reallivezoneaction';

export interface PostActionInfo {
    outcome: ActionOutcome;
    nextAction: LiveZoneAction;
}

@Injectable()
export class ActionService implements IActionService {

    public currentAction: RealLiveZoneAction;
    public activeZone: Zone;
    // Replays the one last action
    public postActionSubject: Subject<PostActionInfo> =
        new ReplaySubject<PostActionInfo>(1);

    private _actionSpeedMultiplier = 1.0;
    // Inexperience penalty multiplied by this amount
    public inexpMultiplier = 1.0;

    // Experimental
    protoActionOutcomeSubject: Subject<ProtoActionOutcome> =
        new Subject<ProtoActionOutcome>();

    constructor(
        private PS: PlayerService,
        private stats: StatsService
    ) { }

    get actionSpeedMultiplier(): number {
        return this._actionSpeedMultiplier;
    }
    set actionSpeedMultiplier(newValue: number) {
        console.assert(newValue > 0 && this._actionSpeedMultiplier > 0);
        let speedup = newValue / this._actionSpeedMultiplier;
        if (this.currentAction) {
            this.currentAction.adjustRemainingTime(speedup);
        }
        this._actionSpeedMultiplier = newValue;
    }

    // ------------------- ACTION BOOKKEEPING --------------------------

    /** Immediately terminate any action running in this zone, and stop
    looping actions for that zone. **/
    stopActionLoop(zone: Zone) {
        // TODO: would be cool to define a decorator that says "this is
        // a no-op if there's no actions going on right now"
        if (!this.activeZone || this.activeZone != zone) { return; }
        this.activeZone = undefined;
        this.currentAction.kill();
        this.currentAction = undefined;
    }
    stopAllActions() {
        if (this.activeZone) {
            this.stopActionLoop(this.activeZone);
        }
    }

    /** Return the currently running action in the given zone, if any **/
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
            this.postActionSubject.next(post);
            this.stats.actionTaken(this.activeZone.name);
        };
        let action: RealLiveZoneAction = new RealLiveZoneAction(
            desc.present, delay, cb, this.activeZone.zid);
        this.currentAction = action;
        return action;
    }

    // ------------------- ACTION MECHANICS --------------------------

    private getDelay(action: ZoneAction): number {
        let delay = action.delay(this.PS.getSkillLevels());
        let inexp = 1.0 + (this.inexpMultiplier * (delay.inexperiencePenalty - 1));
        if (inexp != delay.inexperiencePenalty) {
            console.log(`Ineptitude penalty adjusted from
                ${delay.inexperiencePenalty} to ${inexp}.`);
        }
        let skillAdjustedDelay = delay.base * inexp;
        let buffedDelay = skillAdjustedDelay / this.actionSpeedMultiplier;
        if (skillAdjustedDelay != buffedDelay) {
            console.log(`Buffed: ${buffedDelay}`);
        }
        return buffedDelay;
    }

    private getOutcome(action: ZoneAction, mainDesc: string): ActionOutcome {
        let proto:ProtoActionOutcome = {action: action,
            kickers: new Array<SecondaryAction>(),
            zone: this.activeZone,
            spMultiplier: 1
        };
        // By broadcasting this, we give observers the chance to mutate it
        // (by adding secondary effects), before we apply. Probably before.
        // Still not clear on the rxjs scheduler stuff.
        this.protoActionOutcomeSubject.next(proto);
        let crit = this.checkCrits(proto);
        // TODO: XXX: Probably want to pass this on in some more structured way
        // to the UI, and maybe some perk listeners or something. Being lazy for now.
        if (crit) {
            mainDesc += ' CRIT!';
        }
        let spBoost = (s: SkillMap, mlt: number) => s.map((sp) => sp*mlt);
        let mainEvent = {description: mainDesc,
            pointsGained: this.PS.trainSkills(
                spBoost(action.skillDeltas, proto.spMultiplier)
            )};
        let kickerEvents:ActionEvent[] = new Array<ActionEvent>();
        for (let secondary of proto.kickers) {
            let kickerOutcome:ActionEvent = {description: secondary.description};
            if (secondary.skillPoints) {
                kickerOutcome.pointsGained = this.PS.trainSkills(
                    spBoost(secondary.skillPoints, proto.spMultiplier)
                );
            }
            kickerEvents.push(kickerOutcome);
        }
        let outcome:ActionOutcome = {main: mainEvent, secondary:kickerEvents};
        return outcome;
    }

    private checkCrits(proto: ProtoActionOutcome) : boolean {
        if (Math.random() < this.PS.player.meta.critChance) {
            /** TODO: seems like the crit multiplier should probably only
                apply to SP from the main outcome, and not from kickers. **/
            proto.spMultiplier *= this.PS.player.meta.critMultiplier;
            return true;
        } else {
            return false;
        }
    }

    // TODO: Used to be a method of zone, and now feels kind of weird here
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
