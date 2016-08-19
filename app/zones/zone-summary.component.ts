import { Component, Input, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { Zone, getTruthySkills, SkillType } from '../core/index';

import { PlayerService } from '../player/player.service';
import { Zones } from './zones.service';

@Component({
    selector: 'zone-summary',
    directives: [ ROUTER_DIRECTIVES ],
    // TODO: Only show description when expanded?
    // TODO: define a pipe (component) for skilltype stuff
    template: `
    <div>
    {{zone.name}}
    <span *ngFor="let diff of difficulties()">
        {{ST[diff.skill]}}: {{difficultyString(diff.difficulty)}}
    </span>
    {{zone.description}}
    <button (click)="explore()">Explore</button>
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
