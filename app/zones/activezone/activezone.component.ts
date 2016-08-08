import { OnInit, OnDestroy, Component, Input } from '@angular/core';
import { ZoneAction, ActionOutcome, ActionOutcomeEvent, ActionService, Zone } from '../shared';
import { SkillType, truthySkills } from '../../skills';

@Component({
    selector: 'active-zone',
    // TODO: Css junk - figure out how to put "ongoing" text stationary in the middle
    // of the progress div

    // Without tweak to transition-duration, it's very jerky
    styles: [`
        .progress-bar {
            transition-duration: .1s;
        }`],
    template: `
    <div class="progress">
        <span class="ongoing">
            {{currentAction.description.present}}
        </span>
        <div class="progress-bar" [style.width.%]="currentAction.pctProgress">
        </div>
    </div>

    <div class="previously" *ngIf="lastOutcome">
        <div class="mainOutcome">{{formatOutcome(lastOutcome.main)}}</div>
        <div *ngFor="let bonus of lastOutcome.secondary" class="secondaryOutcome">
            {{formatOutcome(bonus)}}
        </div>
    </div>
    `,
})

export class ActiveZoneComponent implements OnInit, OnDestroy {
    @Input() zone : Zone;
    currentAction: ZoneAction;
    lastOutcome: ActionOutcome;
    constructor(
        private AS: ActionService
    ) {
    }
    ngOnInit() {
        this.queueAction();
    }
    ngOnDestroy() {
        this.currentAction.kill();
    }
    queueAction() {
        this.currentAction = this.AS.getAction(this.zone);
        this.currentAction.start(
            () => {
                this.lastOutcome = this.AS.resolveAction(this.currentAction);
                this.queueAction();
            }
        );
    }

    formatOutcome(outcome: ActionOutcomeEvent) : string {
        let s = outcome.description;
        if (outcome.skillPoints) {
            s += "(";
            truthySkills(outcome.skillPoints,
                (skill: SkillType, amt: number) => {
                    s += SkillType[skill] + "+" + amt + ", ";
             });
             s += ")";
        }
        return s;
    }
}
