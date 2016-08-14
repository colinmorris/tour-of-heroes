import { Component } from '@angular/core';

import { ProgressBarComponent } from '../shared/progressbar.component';
import { InventoryComponent } from '../items/inventory.component';
import { PerksComponent } from '../perks/perks.component';

import { PlayerService } from './player.service';
import { Player } from './player.interface';

@Component({
    selector: 'player-pane',
    directives: [ProgressBarComponent, InventoryComponent, PerksComponent],
    template: `
    <h2>{{character.name}}, the level {{character.level}}
    {{character.klass}}</h2>
        Level progress:
        <progress-bar [prog]="character"></progress-bar>

        <ul>
            <li *ngFor="let skill of character.skills">
                <b>{{skill.name}}</b>
                Level {{skill.baseLevel}} (+ {{skill.level - skill.baseLevel}})
                Aptitude: {{skill.baseAptitude}}
                    (+ {{skill.aptitude - skill.baseAptitude}})
                <progress-bar [prog]="skill"></progress-bar>
            </li>
        </ul>

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
