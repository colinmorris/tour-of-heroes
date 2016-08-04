import { Component } from '@angular/core';
import { LifetimeStats } from './stats';
import { KLASSES } from './klass.data';
import { GameService } from './game.service';

@Component({
    selector: 'stats',
    template: `
        <h3>Here are some stats!</h3>
        Max level attained:
        <ul>
            <li *ngFor="let klass of klasses">{{klass.name}}: {{stats.maxPlayerLevel[klass.name]}}</li>
        </ul>

        Max skill level attained:
        <ul>
            <li *ngFor="let skill of stats.maxSkillLevel"> {{skill}}</li>
        </ul>

        Actions taken this lifetime: {{stats.actionsTakenThisLifetime}}
            (max across lives: {{stats.actionsTaken}})
        `
})
export class StatsComponent {

    klasses = KLASSES;
    stats: LifetimeStats;
    constructor(private game: GameService) {
        this.stats = game.stats;
    }
}
