import { Component, OnInit } from '@angular/core';

import { GLOBALS } from '../globals';
import { StatsService } from '../stats/stats.service';
import { SerializationService } from './serialization.service';
import { XpFormulas as XP,
ancestryBonus } from '../core/index';

@Component({
    selector: 'debug-pane',
    template: `
    <h1 *ngIf="!cheatMode">What are you doing here? Shoo!</h1>
    <div *ngIf="cheatMode">

    ZI Tokens: {{Stats.ziTokens}}
    <button (click)="Stats.ziTokens = Stats.ziTokens+1">Get token</button>

    <table class="table table-striped">
    <tr>
    <th>Skill Level</th>  <th>Standard SP</th>    <th>SP to lvl</th> <th>Actions to lvl</th>
    </tr>

    <tr *ngFor="let row of levelingData()">
        <td>{{row.lvl}}</td>
        <td>{{row.serving | number:'1.0-1'}}</td>
        <td>{{row.toLvl | number:'1.0-1'}}</td>
        <td>{{row.actions | number:'1.0-0'}}</td>
    </tr>
    <label>n classes
        <input type="text"
            [(ngModel)]="nClasses"
        ></label>
    <label>level per class
        <input type="text"
            [(ngModel)]="levelPerClass"
        ></label>
    <label>Max skill level
        <input type="text"
            [(ngModel)]="maxSkillLvl"
        ></label>
    <p>Ancestry bonus: {{ancestryBonus() | number:'1.0-1'}}</p>

    </table>

    <button (click)="statsString=!statsString">Stats JSON</button>
    <div *ngIf="statsString">
        <code>{{statsJson()}}</code>
    </div>
    <textarea [(ngModel)]="stringToLoad"></textarea>
    <button (click)="loadFromString()">Load</button>
    </div>
    `,
})
export class DebugComponent {
    stringToLoad;
    statsString = false;
    nClasses = 0;
    levelPerClass = 10;
    maxSkillLvl = 50;
    cheatMode = GLOBALS.cheatMode;
    constructor(
        private Stats: StatsService,
        private Cereal: SerializationService
    ) {

    }

    loadFromString() {
        if (!this.stringToLoad) {
            console.warn("Nothing to load");
            return;
        }
        this.Cereal.loadFromString(this.stringToLoad);
        location.reload();
    }

    statsJson() {
        //return JSON.stringify(this.Stats.stats);
        return this.Cereal.exportToString();
    }

    ancestryBonus() {
        let plvls = [];
        for (let i=0; i < this.nClasses; i++) {
            plvls.push(this.levelPerClass);
        }
        return ancestryBonus(plvls);
    }

    levelingData() {
        let dat = [];
        let anc = this.ancestryBonus();
        for (let lvl=0; lvl <= this.maxSkillLvl; lvl+=5) {
            let serving = XP.standardSpServingForSkillLevel(lvl) * (1+anc);
            let toLvl = XP.skillPointsToAdvanceLevel(lvl);
            dat.push({
                lvl: lvl,
                serving: serving,
                toLvl: toLvl,
                actions: toLvl/serving
            });
        }
        return dat;
    }
}
