import { SkillType } from './skill';
import { ZoneAction } from './zoneaction';

import { GLOBALS } from './globals';

export class Zone {
    actions: ZoneAction[];
    name: string;
    description: string;
    baseDelay: number;

    static fromJSON(j: any) : Zone {
        let z : Zone = new Zone();
        z.name = j.name;
        z.description = j.description;
        z.actions = new Array<ZoneAction>();
        z.baseDelay = j.baseDelay ? j.baseDelay : GLOBALS.defaultBaseZoneDelay;
        for (let a of j.actions) {
            let delay:number = z.baseDelay * (a.delayx ? a.delayx : 1);
            z.actions.push(new ZoneAction(
                a.vb, a.obj, a.opts, a.skills, a.weight, delay
            ));
        }
        return z;
    }


    // Unlock req'ts...

    getAction() : ZoneAction {
        // TODO
        return this.actions[0];
    }
}

