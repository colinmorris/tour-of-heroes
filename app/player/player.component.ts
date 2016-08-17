import { Component } from '@angular/core';

import { ProgressBarComponent } from '../shared/progressbar.component';
import { InventoryComponent } from '../items/inventory.component';
import { PerksComponent } from '../perks/perks.component';
import { BuffedStatComponent } from './buffed-stat.component';

import { PlayerService } from './player.service';
import { Player } from './player.interface';

@Component({
    selector: 'player-pane',
    directives: [ProgressBarComponent, InventoryComponent, PerksComponent,
        BuffedStatComponent],
    styles: [
        `
        .skillbars progress-bar >>> div {
            margin-bottom: 0;
            width: 70%;
        }
        `
    ],
    template: `
    <h2>{{character.name}}, the level {{character.level}}
    {{character.klass}}</h2>
        Level progress:
        <progress-bar [prog]="character"></progress-bar>

        <div class="skillbars">
            <div *ngFor="let skill of character.skills">

                <div>
                <b>{{skill.name}}</b>
                Level <buffed-stat [base]="skill.baseLevel" [buffed]="skill.level">
                </buffed-stat>
                Aptitude: <buffed-stat [base]="skill.baseAptitude"
                    [buffed]="skill.aptitude"></buffed-stat>
                </div>

                <progress-bar [prog]="skill"></progress-bar>
            </div>
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
