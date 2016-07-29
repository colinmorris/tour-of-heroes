import { SkillType } from './skill';
import { ZoneAction, ZoneActionModel } from './zoneaction';
import { Player } from './player';

import { GLOBALS } from './globals';

export class Zone {
    zid: number;
    actions: ZoneActionModel[];
    name: string;
    description: string;
    baseDelay: number;

    // TODO: this method is dumb
    static fromJSON(j: any, id:number) : Zone {
        let z : Zone = new Zone();
        z.zid = id;
        z.name = j.name;
        z.description = j.description;
        z.actions = new Array<ZoneActionModel>();
        z.baseDelay = j.baseDelay ? j.baseDelay : GLOBALS.defaultBaseZoneDelay;
        for (let a of j.actions) {
            let delay:number = z.baseDelay * (a.delayx ? a.delayx : 1);
            z.actions.push(new ZoneActionModel(
                a.vb, a.obj, a.opts, a.skills, a.weight, delay
            ));
        }
        return z;
    }

    // Unlock req'ts...

    getAction(player: Player) : ZoneAction {
        // TODO
        let actionType: ZoneActionModel = this.actions[0];
        return new ZoneAction(actionType, player);
    }
}

