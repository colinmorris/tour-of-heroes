import { Component } from '@angular/core';

import { ProgressBarComponent } from '../shared/progressbar.component';
import { PerksComponent } from '../perks/perks.component';
import { BuffedStatComponent } from './buffed-stat.component';
import { SkillComponent } from '../shared/skill.component';

import { KlassService } from '../klasses/klass.service';
import { PlayerService } from './player.service';
import { Player } from './player.interface';

@Component({
    selector: 'player-pane',
    directives: [ProgressBarComponent, PerksComponent,
        BuffedStatComponent, SkillComponent],
    styles: [
        `
        .skillbars progress-bar >>> div {
            margin-bottom: 0;
        }
        .list-group-item {
            padding-top: 5px;
            padding-bottom: 5px;
        }
        .char-icon {
            width: 100%;
        }
        .lvl {
            font-weight: bold;
        }
        .charcol {
            display: inline-block;
            vertical-align: middle;
            float: none;
        }
        .chartext p {
            line-height: 1.2;
        }
        `
    ],
    template: `
    <div class="row">
        <div class="col-xs-6 charcol">
        <img class="char-icon"
             [src]="KS.iconForKlass(character.klass)"
             [title]="character.klass"
        >
        </div><div class="col-xs-6 charcol chartext">
        <h4>
        <p class="text-left">Level
        <span class="lvl">{{character.level}}</span>
        {{character.klass}}</p>
        </h4>
        </div>

    </div>
    <div class="row">
    <div class="col-xs-8 col-xs-offset-2">
    <progress-bar [prog]="character"></progress-bar>
    </div>
    </div>

    <div class="skillbars">
        <ul class="list-group">

            <li class="list-group-item">
            <div class="row">
                <div class="col-xs-4 col-xs-offset-2">
                    <b
    title="Skill level. Raise these to take on more difficulty zones and raise your player level.">
                    Level</b>
                </div>

                <div class="col-xs-4 col-xs-offset-2">
                    <b title="Skill gains are multiplied by this"
                    >Aptitude</b>
                </div>
            </div>
            </li>

        <li *ngFor="let skill of character.skills" class="list-group-item">
        <div class="row">

            <div class="col-xs-2">
            <skill [skill]="skill.id" [title]="skill.name"></skill>
            </div>

            <div class="col-xs-2">
            <buffed-stat [base]="skill.baseLevel" [buffed]="skill.level" [toast]="true">
            </buffed-stat>
            </div>

            <div class="col-xs-6">
            <progress-bar [prog]="skill"></progress-bar>
            </div>

            <div class="col-xs-2">
            <buffed-stat [base]="skill.baseAptitude"
                [buffed]="skill.aptitude"></buffed-stat>
            </div>
        </div>
        </li>
        </ul>
    </div>

    <perks></perks>

    <inventory></inventory>
    `
})
export class PlayerComponent {
    character: Player;
    constructor (
        private PS: PlayerService,
        private KS: KlassService
    ) {
        this.character = PS.player;
    }



}
