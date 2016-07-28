import { Component } from '@angular/core';

import { PlayerService } from './player.service';

@Component({
    selector: 'player-pane',
    template: `
        <div class="player-info">

        <h2>{{player.name}}, the level {{player.level}} {{player.klass}}</h2>
            Level progress: 
            <div class="progress">
                <div class="progress-bar" [style.width.%]="player.percentProgress()"></div>
                {{player.totalSkillLevels}} / {{player.skillLevelsForNextLevel()}}
            </div>

            <ul>
                <li *ngFor="let skill of player.skills">
                    <b>{{skill.name}}</b>
                    Level {{skill.level}} (apt={{skill.aptitude}})
                    <div class="progress">
                        <div id="pbar{{skill.id}}" class="progress-bar" [style.width.%]="skill.percentProgress()"></div>{{skill.skillPoints}} / {{skill.pointsForNextLevel()}}
                    </div>
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
