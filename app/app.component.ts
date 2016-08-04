import { Component } from '@angular/core';

import { GameService } from './game.service';

import { TickerService } from './ticker.service';
import { TickerComponent } from './ticker.component';

import { ActiveZoneService } from './activezone.service';

import { HomeComponent } from './home.component';
import { KlassesComponent } from './klasses.component';


@Component({
    selector: 'my-app',
    directives: [HomeComponent, KlassesComponent, TickerComponent],
    template: `
    <nav>
        <a (click)="view='home'">Home</a>
        <a (click)="view='klasses'">Classes</a>
    </nav>
    <home [hidden]="view != 'home'"></home>
    <klass-viewer [hidden]="view != 'klasses'">
    <div class="row">
        <ticker></ticker>
        <button (click)="gameService.saveState()">Save</button>
        <button (click)="gameService.clearSave()">Reset Save</button>
    </div>
  `,
  providers: [TickerService, GameService, ActiveZoneService]
})

export class AppComponent {
    view: string = "home";

    constructor(private gameService: GameService) {}
}


