import { Component, Input, OnInit, OnDestroy,
    ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { Zone, getTruthySkills, SkillType,
    SkillDifficulty, ZoneDifficulty } from '../core/index';

import { PlayerService } from '../player/player.service';
import { Zones } from './zones.service';

import { SkillComponent } from '../shared/skill.component';

@Component({
    selector: 'zone-summary',
    directives: [ ROUTER_DIRECTIVES, SkillComponent ],
    styles: [`
        `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="row">

    <div class="col-xs-2">
    <span title="DEBUG: difficulty={{zone.difficulty}}">{{nameString(zone)}}</span>
    </div>

    <div class="col-xs-1">
        {{zone.difficulty}}
    </div>

    <div class="col-xs-4">
    <span *ngFor="let diff of difficulties()">
        <skill [skill]="diff.skill"
            [bg]="difficultyColor(diff.difficulty)"
            [title]="difficultyString(diff)"
            >
        </skill>
    </span>
    </div>

    <div class="col-xs-2">
    <span class="overall-difficulty"
    >
          {{penaltyString(overallDifficulty())}}
    </span>
    </div>

    <div class="col-xs-3" *ngIf="live">
    <button *ngIf="!youAreHere"
        class="btn"
        [class.disabled]="locked"
        (click)="explore()">
        {{buttonText()}}</button>
    <h4 *ngIf="youAreHere">
        <span class="label label-success">
        You are here
        </span>
    </h4>
    </div>

    </div>
    `
})
export class ZoneSummaryComponent implements OnInit, OnDestroy {
    ST = SkillType;
    @Input() youAreHere: boolean = false;
    /** If we're not live, this becomes non-interactive (i.e. no button to
    navigate to the zone). Used in previews.
    **/
    @Input() live: boolean = true;
    @Input() zone: Zone;
    /** TODO: Maybe if this zone/superzone hasn't been unlocked yet in any
    lifetime, the zone/sz names should just show as "???"
    **/
    @Input() locked: boolean;
    private skillsub;
    zd: ZoneDifficulty;

    constructor(
        private router: Router,
        private zones: Zones,
        private PS: PlayerService,
        private cd: ChangeDetectorRef
    ) {

    }

    ngOnInit() {
        /** If we wanted to be really fancy, we could check once which skills
        this zone involves, and only listen for changes to those skills. But
        let's not go nuts.
        **/
        console.assert(this.skillsub == undefined || this.skillsub.isUnsubscribed);
        this.skillsub = this.PS.player.skillChange$.subscribe( () => {
            this.update();
        });
        this.zd = this.zone.difficultyPerSkill(this.PS.player);
    }

    ngOnDestroy() {
        if (this.skillsub) {
            this.skillsub.unsubscribe();
        }
    }

    ngOnChanges() {
        /** Need this for use of this component in the "level up" preview view,
        where the zone may change in place. **/
        this.zd = this.zone.difficultyPerSkill(this.PS.player);
    }

    update() {
        this.zd = this.zone.difficultyPerSkill(this.PS.player);
        this.cd.markForCheck();
    }

    buttonText() {
        return this.locked ? "Locked" : "Go";
    }

    nameString(zone: Zone) {
        return zone.name;
    }

    explore() {
        this.zones.focalZone = this.zone;
    }

    difficultyColor(diff: number) {
        if (diff <= 0.005) {
            return 'lightgreen';
        } else if (diff <= .5){
            return 'yellow';
        } else if (diff <= 2) {
            return 'orange';
        } else {
            return 'maroon';
        }
    }

    difficultyString(d: any) : string {
        let diffWordFn = (diff) => {
            if (diff <= 0.005) {
                return 'easy';
            } else if (diff <= .5){
                return 'challenging';
            } else if (diff <= 2) {
                return 'hard';
            } else {
                return 'grueling';
            }
        }
        let currSkill = this.PS.getSkillLevel(d.skill);
        return `${diffWordFn(d.difficulty)}:
            penalty=${this.penaltyString(d.difficulty)}
             mastered at level ${Math.ceil(d.masteredAt)} (currently: ${currSkill})`;
    }

    penaltyString(penalty) : string {
        let pct = (penalty * 100).toFixed(0);
        return pct == "0" ? "" : pct+'%';
    }

    overallDifficulty() {
        return this.zd.score;
    }

    difficulties() {
        let diffs = [];
        let diffLvls = this.zd.perSkill;
        for (let skill of getTruthySkills(diffLvls)) {
            diffs.push({
                skill: skill,
                difficulty: diffLvls[skill].penalty,
                masteredAt: diffLvls[skill].masteredAt
            });
        }
        return diffs;
    }
}
