import { SkillMap, SkillType, JSONtoSkillMap } from './skill';
import { ZoneAction, ZoneActionModel } from './zoneaction';
import { GameService } from './game.service';
import { ZoneData } from './zones.data';

import { GLOBALS } from './globals';

export class Zone {
    zid: number;
    superzone: string;
    actions: ZoneActionModel[];
    name: string;
    description: string;
    baseDelay: number;
    // convenience
    private totalWeight: number = 0;

    static fromJSON(j: ZoneData, id:number, superzone: string) : Zone {
        let z : Zone = new Zone();
        z.superzone = superzone;
        z.zid = id;
        z.name = j.name;
        z.description = j.description;
        z.baseDelay = j.baseDelay ? j.baseDelay : GLOBALS.defaultBaseZoneDelay;
        
        z.actions = new Array<ZoneActionModel>();
        for (let a of j.actions) {
            let delay:number = z.baseDelay * (a.delayx ? a.delayx : 1);
            let zam: ZoneActionModel = ZoneActionModel.fromJSON(a, delay);
            z.actions.push(zam);
            z.totalWeight += a.weight;
        }
        return z;
    }

    // Unlock req'ts...

    getAction(gameService: GameService) : ZoneAction {
        let dice: number = Math.random() * this.totalWeight;
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

