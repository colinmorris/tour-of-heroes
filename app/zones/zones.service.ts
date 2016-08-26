import { Injectable } from '@angular/core';

import { SUPERZONES, SuperZone,
    Zone } from '../core/index';


/** This is a pretty sorry excuse for a service at this point. Will probably
    find more uses for it later though.
**/
@Injectable()
export class Zones {

    // TODO: Should probably be a subject?
    public focalZone: Zone = SUPERZONES[0].zones[0];

    get superzones() : SuperZone[] {
        return SUPERZONES;
    }
}
