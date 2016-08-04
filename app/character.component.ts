import { Component } from '@angular/core';

import { ProgressBarComponent } from './progressbar.component';
import { PlayerService } from './player.service';
import { Player, Character } from './player';
import { Skill } from './skill';

@Component({
    selector: 'player-pane',
    directives: [ProgressBarComponent],
    template: `
        <div class="player-info">

        <h2>{{character.name}}, the level {{character.level}} {{character.klass.name}}</h2>
            Level progress: 
            <progress-bar [numerator]="character.totalSkillLevels" [denominator]="character.skillLevelsForNextLevel()"></progress-bar>

            <ul>
                <li *ngFor="let skill of character.skills">
                    <b>{{skill.name}}</b>
                    Level {{skill.level}} {{aptitudeString(skill)}}
                    <progress-bar [numerator]="skill.skillPoints" [denominator]="skill.pointsForNextLevel()"></progress-bar>
                </li>
            </ul>
        </div>
`,
})

export class CharacterComponent {
    player : Player;
    character: Character;

    constructor(private playerService : PlayerService) {
        this.player = playerService.player;
        this.character = this.player.character;
    }

    aptitudeString(skill: Skill) {
        return `aptitude = ${ skill.effectiveAptitude } 
        (${skill.aptitude} + ${skill.bonusAptitude})`;
    }
}
