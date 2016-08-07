import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Zone } from './zone';
import { ZoneActionModel, ZoneAction, ActionOutcome, ActionOutcomeEvent } from './zoneaction';
import { StatsService } from './stats.service';
import { InventoryService } from './inventory.service';
import { PlayerService } from './player.service';
import { KickerPerk } from './perk';
import { SkillType, truthySkills } from './skill.data';
import { Item, Manual } from './item';
import { GLOBALS } from './globals';

@Injectable()
export class ActionService {

    constructor(
        private ps: PlayerService,
        private inv: InventoryService,
        private statsService: StatsService
    ) {}

    getAction(zone: Zone) : ZoneAction {
        let zam : ZoneActionModel = zone.chooseAction();
        let delay : number = zam.delay(this.ps.chara);
        // TODO: Does ZA need the whole ZAM?
        return new ZoneAction(zam, delay, zone);
    }

    resolveAction(action: ZoneAction) : ActionOutcome {
        let mainEvent : ActionOutcomeEvent = {
            description: action.description.past,
            skillPoints: action.action.skillDeltas
        };
        let kickers: ActionOutcomeEvent[] = this.getKickers(action);
        let outcome: ActionOutcome = {main: mainEvent, secondary: kickers};
        // Note that application will mutate the outcome - most obviously, aptitudes
        // will transform the base skill point gains, but other changes are possible as well
        this.applyOutcome(outcome);
        this.statsService.actionTaken();
        return outcome;
    }

    private getKickers(action: ZoneAction) : ActionOutcomeEvent[] {
        let perkKickers: ActionOutcomeEvent[] = KickerPerk.getKickers(this.ps.chara, action);
        if (Math.random() < GLOBALS.dropRate) {
            // random drop
            let dropKick : ActionOutcomeEvent = this.randomDrop();
            perkKickers.push(dropKick);
        }
        return perkKickers;
    }

    private randomDrop() : ActionOutcomeEvent {
      let randSkill = SkillType.Farming;
      let item : Item = new Manual(randSkill);
      return {description: `You found a ${item.name}`,
          item: item};
    }

    // Has side effects!
    private applyOutcome(outcome: ActionOutcome) {
        this.applyOutcomeEvent(outcome.main);
        for (let other of outcome.secondary) {
            this.applyOutcomeEvent(other);
        }
    }

    private applyOutcomeEvent(outcome: ActionOutcomeEvent) {
        if (outcome.skillPoints) {
            debugger;
            truthySkills(outcome.skillPoints,
                     (skill: SkillType, delta: number) => {
                         let points:number = this.ps.trainSkill(skill, delta);
                         outcome.skillPoints[<number>skill] = points;
                        });
            debugger;
        }
        if (outcome.item) {
            let success: boolean = this.inv.addItem(outcome.item);
            if (!success) {
                // Should probably also set outcome.item to undefined?
                outcome.description = `You found a ${outcome.item.name}, but had no room to carry it.`;
            }
        }
    }

}
