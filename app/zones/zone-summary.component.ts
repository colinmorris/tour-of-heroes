import { Component, Input, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { Zone, getTruthySkills, SkillType } from '../core/index';

import { PlayerService } from '../player/player.service';
import { Zones } from './zones.service';

import { SkillComponent } from '../shared/skill.component';

@Component({
    selector: 'zone-summary',
    directives: [ ROUTER_DIRECTIVES, SkillComponent ],
    // TODO: Only show description when expanded?
    // TODO: define a pipe (component) for skilltype stuff
    template: `
    <div class="row">

    <div class="col-xs-3">
    {{zone.name}}
    </div>

    <div class="col-xs-6">
    <span *ngFor="let diff of difficulties()">
        <skill [skill]="diff.skill"
            [bg]="difficultyColor(diff.difficulty)"
            [title]="difficultyString(diff.difficulty)"
            >
        </skill>
    </span>
    </div>

    <div class="col-xs-3">
    <button *ngIf="zones.focalZone.zid != zone.zid"
        class="btn" (click)="explore()">Go</button>
    <h4 *ngIf="zones.focalZone.zid == zone.zid">
        <span class="label label-success">
        You are here
        </span>
    </h4>
    </div>

    </div>
    `
})
export class ZoneSummaryComponent {
    ST = SkillType;
    @Input() zone: Zone;

    constructor(
        private router: Router,
        private zones: Zones,
        private PS: PlayerService
    ) {
    }

    explore() {
        this.zones.focalZone = this.zone;
    }

    difficultyColor(diff: number) {
        if (diff <= 1) {
            return 'lightgreen';
        } else if (diff <= 1.5){
            return 'yellow';
        } else if (diff <= 3) {
            return 'orange';
        } else {
            return 'maroon';
        }
    }

    difficultyString(diff: number) : string {
        if (diff <= 1) {
            return 'easy';
        } else if (diff <= 1.5){
            return 'challenging';
        } else if (diff <= 3) {
            return 'hard';
        } else {
            return 'grueling';
        }
    }

    difficulties() {
        let diffs = [];
        let diffLvls = this.zone.difficultyPerSkill(this.PS.getSkillLevels());
        for (let skill of getTruthySkills(diffLvls)) {
            diffs.push({skill: skill, difficulty: diffLvls[skill]});
        }
        return diffs;
    }
}
