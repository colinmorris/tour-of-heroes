import { Component, forwardRef } from '@angular/core';

import { ProgressBarComponent } from '../../shared';
import { PlayerService, Player } from '../shared';
import { Skill } from '../../skills';
import { InventoryComponent } from '../../items';

@Component({
    selector: 'player-pane',
    directives: [
        forwardRef(() => ProgressBarComponent), 
        forwardRef(() => InventoryComponent)],
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

export class PlayerComponent {
    get character() : Player {
        return this.game.chara;
    }

    constructor(private game : PlayerService) {
    }

    aptitudeString(skill: Skill) {
        return `aptitude = ${ skill.effectiveAptitude }
        (${skill.aptitude} + ${skill.bonusAptitude})`;
    }
}
