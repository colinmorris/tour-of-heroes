import { Injectable } from '@angular/core';

import { SuperZone, loadSuperZones,
    Zone } from '../core/index';

import { StatsService } from '../stats/stats.service';


/** This is a pretty sorry excuse for a service at this point. Will probably
    find more uses for it later though.
**/
@Injectable()
export class Zones {

    // TODO: Should probably be a subject?
    /** The zone that was last "focal" in the homeComponent
    **/
    public focalZone: Zone;
    public superzones: SuperZone[];
    constructor(
        private Stats: StatsService
    ) {
        this.reloadZones();
        this.resetFocalZone();
    }

    resetFocalZone() {
        this.focalZone = this.superzones[0].zones[0];
    }

    reloadZones() {
        // todo: having stats public is dumb
        this.superzones = loadSuperZones(this.Stats.stats.current.zoneLevels);
    }
}
