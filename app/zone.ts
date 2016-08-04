import { SkillMap, SkillType, JSONtoSkillMap } from './skill';
import { ZoneAction, ZoneActionModel } from './zoneaction';
import { Player } from './player';

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

    // TODO: this method is dumb
    static fromJSON(j: any, id:number, superzone: string) : Zone {
        let z : Zone = new Zone();
        z.superzone = superzone;
        z.zid = id;
        z.name = j.name;
        z.description = j.description;
        z.actions = new Array<ZoneActionModel>();
        z.baseDelay = j.baseDelay ? j.baseDelay : GLOBALS.defaultBaseZoneDelay;
        for (let a of j.actions) {
            let delay:number = z.baseDelay * (a.delayx ? a.delayx : 1);
            //console.log(`Reduced delay of ${a.vb} from ${z.baseDelay} to ${delay}`);
            z.actions.push(new ZoneActionModel(
                a.vb, a.obj, a.opts, 
                JSONtoSkillMap(a.skills), 
                a.weight, delay
            ));
            z.totalWeight += a.weight;
        }
        return z;
    }

    // Unlock req'ts...

    getAction(player: Player) : ZoneAction {
        let dice: number = Math.random() * this.totalWeight;
        let sofar = 0;
        for (let zam of this.actions) {
            sofar += zam.weight;
            if (sofar > dice) {
                return new ZoneAction(zam, player);
            }
        }
        console.assert(false, "Shouldnt have reached here.");
    }
}

