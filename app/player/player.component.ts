import { Component } from '@angular/core';

import { ProgressBarComponent } from '../shared/index';
import { InventoryComponent } from '../items/inventory.component';

import { PlayerService } from './player.service';
import { Player } from '../core/index';

@Component({
    selector: 'player-pane',
    directives: [ProgressBarComponent, InventoryComponent],
    template: `
    <h2>{{character.name}}, the level {{character.level}}
    {{character.klass.name}}</h2>
        Level progress:
        <progress-bar [numerator]="character.totalSkillLevels"
            [denominator]="character.skillLevelsForNextLevel()"></progress-bar>

        <ul>
            <li *ngFor="let skill of character.skills">
                <b>{{skill.name}}</b>
                Level {{skill.level}} {{aptitudeString(skill)}}
                <progress-bar [numerator]="skill.skillPoints" [denominator]="skill.pointsForNextLevel()"></progress-bar>
            </li>
        </ul>

        <inventory></inventory>
    `
})
export class PlayerComponent {
    player: Player;
    constructor (
        private PS: PlayerService
    ) {
        this.player = PS.player;
    }

}
