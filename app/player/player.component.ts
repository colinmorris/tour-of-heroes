import { Component } from '@angular/core';

import { ProgressBarComponent } from '../shared/progressbar.component';
import { InventoryComponent } from '../items/inventory.component';
import { PerksComponent } from '../perks/perks.component';
import { BuffedStatComponent } from './buffed-stat.component';
import { SkillComponent } from './skill.component';

import { PlayerService } from './player.service';
import { Player } from './player.interface';

@Component({
    selector: 'player-pane',
    directives: [ProgressBarComponent, InventoryComponent, PerksComponent,
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
        `
    ],
    template: `
    <h2>{{character.name}}, the level {{character.level}}
    {{character.klass}}</h2>
        Level progress:
        <progress-bar [prog]="character"></progress-bar>

        <div class="skillbars">
            <ul class="list-group">

                <li class="list-group-item">
                <div class="row">
                    <div class="col-xs-4 col-xs-offset-2">
                        <b>Level</b>
                    </div>

                    <div class="col-xs-4 col-xs-offset-2">
                        <b>Aptitude</b>
                    </div>
                </div>
                </li>

            <li *ngFor="let skill of character.skills" class="list-group-item">
            <div class="row">

                <div class="col-xs-2">
                <skill [skill]="skill.id"></skill>
                </div>

                <div class="col-xs-2">
                <buffed-stat [base]="skill.baseLevel" [buffed]="skill.level">
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
        private PS: PlayerService
    ) {
        this.character = PS.player;
    }



}
