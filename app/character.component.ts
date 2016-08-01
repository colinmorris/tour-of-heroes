import { Component } from '@angular/core';

import { ProgressBarComponent } from './progressbar.component';
import { PlayerService } from './player.service';
import { Player } from './player';

@Component({
    selector: 'player-pane',
    directives: [ProgressBarComponent],
    template: `
        <div class="player-info">

        <h2>{{player.name}}, the level {{player.level}} {{player.klass.name}}</h2>
            Level progress: 
            <progress-bar [numerator]="player.totalSkillLevels" [denominator]="player.skillLevelsForNextLevel()"></progress-bar>

            <ul>
                <li *ngFor="let skill of player.skills">
                    <b>{{skill.name}}</b>
                    Level {{skill.level}} (apt={{skill.aptitude}})
                    <progress-bar [numerator]="skill.skillPoints" [denominator]="skill.pointsForNextLevel()"></progress-bar>
                </li>
            </ul>
        </div>
`,
})

export class CharacterComponent {
    player : Player;

    constructor(private playerService : PlayerService) {
        this.player = playerService.player;
    }
}
