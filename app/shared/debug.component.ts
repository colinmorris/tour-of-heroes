import { Component, OnInit } from '@angular/core';

import { GLOBALS } from '../globals';
import { StatsService } from '../stats/stats.service';

@Component({
    selector: 'debug-pane',
    template: `
    <h1 *ngIf="!cheatMode">What are you doing here? Shoo!</h1>
    <div *ngIf="cheatMode">

    ZI Tokens: {{Stats.ziTokens}}
    <button (click)="Stats.ziTokens = Stats.ziTokens+1">Get token</button>

    </div>
    `,
})
export class DebugComponent {
    cheatMode = GLOBALS.cheatMode;
    constructor(
        private Stats: StatsService
    ) {

    }
}
