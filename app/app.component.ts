import { Component } from '@angular/core';
import { Player } from './player';
import { Skill, SKILLNAMES } from './skill';

@Component({
    selector: 'my-app',
    template: `
    <div class="player-info">

    <h2>{{player.name}}, the level {{player.level}} {{player.klass}}</h2>
    <ul>
        <li *ngFor="let skill of player.skills">
            <b>{{skill.name}}</b>
            {{skill.level}} (apt={{skill.aptitude}})
        </li>
    </ul>
    </div>

    <div class="actions">
    </div>

    <div class="scrolling-text">
    </div>

    <div class="reincarnate">
    </div>
  `
})

/*
}
*/

export class AppComponent {
    player : Player = {
        name: 'Coolin',
        skills: SKILLS,
        level: 1,
        klass: 'Peasant',
    };
}

const SKILLS: Skill[] = [];
for (let sk of SKILLNAMES) {
    let skill : Skill = {name: sk, level: 0.0, aptitude: 1.0};
    SKILLS.push(skill);
}
