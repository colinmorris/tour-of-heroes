import { ZoneAction, ZoneActionModel } from './zoneaction';
import { GameService } from './game.service';

import { GLOBALS } from './globals';

export class Zone {
    zid: number;
    superzone: string;
    actions: ZoneActionModel[];
    name: string;
    description: string;
    difficulty: number;

    getAction(gameService: GameService) : ZoneAction {
        // Weights are guaranteed to sum to 1, so no rescaling necessary
        let dice: number = Math.random();
        let sofar = 0;
        for (let zam of this.actions) {
            sofar += zam.weight;
            if (sofar > dice) {
                return new ZoneAction(zam, gameService);
            }
        }
        console.assert(false, "Shouldnt have reached here.");
    }
}

