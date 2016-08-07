import { Component } from '@angular/core';

import { ProgressBarComponent } from './progressbar.component';
import { PlayerService } from './player.service';
import { Character } from './character';
import { Skill } from './skill';
import { InventoryComponent } from './inventory.component';

@Component({
    selector: 'player-pane',
    directives: [ProgressBarComponent, InventoryComponent],
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

            <inventory></inventory>
        </div>
`,
})

export class CharacterComponent {
    get character() : Character {
        return this.game.chara;
    }

    constructor(private game : PlayerService) {
    }

    aptitudeString(skill: Skill) {
        return `aptitude = ${ skill.effectiveAptitude }
        (${skill.aptitude} + ${skill.bonusAptitude})`;
    }
}
