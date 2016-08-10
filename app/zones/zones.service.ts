import { Injectable } from '@angular/core';

import { ZONESARR, ZONES, SUPERZONES,
    Zone } from '../core/index';


@Injectable()
export class Zones {

    get superzones() : string[] {
        return SUPERZONES;
    }

    zonesInSuperzone(superzone: string) : Zone[] {
        return ZONES[superzone];
    }
}
