import { Injectable, OnInit } from '@angular/core';
import { GLOBALS } from './globals';
import { Player, Character } from './player';
import { KLASSES } from './klass.data';
import { Klass } from './klass';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/* This is basically the big-global-state-god-object-service (could probably
 * just as well be called 'GameService'). If you want to modify the Player
 * object, you should probably do it through this service. I mean, I should
 * probably enforce that by setting methods to private where appropriate.
 */
@Injectable()
export class PlayerService implements OnInit {
    // TODO XXX YOUAREHERE hook this thing up
    levelSubject: BehaviorSubject<number>;

    constructor() {
        // Apparently OnInit is supposed to be better, but it seems to lead
        // to weird race conditions in this case.
        let saved = localStorage.getItem(GLOBALS.localStorageToken);
        if (saved && GLOBALS.loadSaves) {
            console.log("Loading saved character data");
            this.player = Player.deserialize(saved); 
        } else {
            let defaultKlass: Klass = KLASSES[0];
            console.log("Creating new character");
            let newborn: Character = Character.newborn("Coolin", defaultKlass);
            this.player = new Player(newborn);
        }
        this.levelSubject = new BehaviorSubject<number>(this.player.character.level);
        this.player.character.levelSubject = this.levelSubject;
        this.setupPerks();
    }

    setupPerks() {
        for (let perk of this.player.character.perks) {
            console.log(`Setting up perk ${perk.name}`);
            perk.setup(this);
        }
    }

    player : Player;

    ngOnInit() {
    }

    saveState() {
        localStorage.setItem(GLOBALS.localStorageToken,
                             this.player.serialize()
                            );
    }

    clearSave() {
        // Also reset state?
        localStorage.removeItem(GLOBALS.localStorageToken);
    }
}

