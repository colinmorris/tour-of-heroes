import { Component } from '@angular/core';

import { ProgressBarComponent } from './progressbar.component';
import { GameService } from './game.service';
import { Character } from './character';
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
    character: Character;

    constructor(private gameService : GameService) {
        this.character = gameService.chara;
    }

    aptitudeString(skill: Skill) {
        return `aptitude = ${ skill.effectiveAptitude } 
        (${skill.aptitude} + ${skill.bonusAptitude})`;
    }
}
