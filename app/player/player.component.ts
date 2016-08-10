import { Component } from '@angular/core';

import { ProgressBarComponent } from '../shared/progressbar.component';
import { InventoryComponent } from '../items/inventory.component';

import { PlayerService } from './player.service';
import { Player } from './player';

@Component({
    selector: 'player-pane',
    directives: [ProgressBarComponent, InventoryComponent],
    template: `
    <h2>{{character.name}}, the level {{character.level}}
    {{character.klass}}</h2>
        Level progress:
        <progress-bar [numerator]="character.totalSkillLevels"
            [denominator]="character.skillLevelsForNextLevel()"></progress-bar>

        <ul>
            <li *ngFor="let skill of character.skills">
                <b>{{skill.name}}</b>
                Level {{skill.level}} {{skill.aptitude}}
                <progress-bar [numerator]="skill.skillPoints" [denominator]="skill.pointsForNextLevel()"></progress-bar>
            </li>
        </ul>

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
