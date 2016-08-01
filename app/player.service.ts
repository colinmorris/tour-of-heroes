import { Injectable, OnInit } from '@angular/core';
import { GLOBALS } from './globals';
import { Player } from './player';
import { KLASSES } from './klass.data';

import { TickerService } from './ticker.service';

@Injectable()
export class PlayerService implements OnInit {

    constructor(private tickerService: TickerService) {
        // Apparently OnInit is supposed to be better, but it seems to lead
        // to weird race conditions in this case.
        let saved = localStorage.getItem(GLOBALS.localStorageToken);
        if (saved && GLOBALS.loadSaves) {
            console.log("Loading saved character data");
            this.player = Player.deserialize(saved); 
            this.player.tickerService = this.tickerService;
        } else {
            console.log("Creating new character");
            this.player = new Player(
                'Coolin',
                1,
                KLASSES[0], // peasant
                this.tickerService
            );
        }
    }

    player : Player;

    ngOnInit() {
    }


    saveState() {
        this.tickerService.log("Saved");
        localStorage.setItem(GLOBALS.localStorageToken,
                             this.player.serialize()
                            );
    }

    clearSave() {
        // Also reset state?
        localStorage.removeItem(GLOBALS.localStorageToken);
    }
}

