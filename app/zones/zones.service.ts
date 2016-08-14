import { Injectable } from '@angular/core';

import { ZONESARR, ZONES, SUPERZONES,
    Zone } from '../core/index';


@Injectable()
export class Zones {

    get superzones() : string[] {
        return SUPERZONES;
    }

    get allZones() : Zone[] {
        let zones: Zone[] = new Array<Zone>();
        for (let superz of this.superzones) {
            zones = zones.concat(this.zonesInSuperzone(superz));
        }
        return zones;
    }

    zonesInSuperzone(superzone: string) : Zone[] {
        return ZONES[superzone];
    }
}
