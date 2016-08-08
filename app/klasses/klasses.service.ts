import { Injectable } from '@angular/core';

import { TickerService } from '../ticker';
import { StatsService, LifetimeStats } from '../stats';

import { KLASSES } from './klass.data';
import { Klass } from './klass.model';

@Injectable()
export class KlassesService {
    klasses: Klass[];
    constructor(
        private ticker: TickerService,
        private statsService: StatsService
    ){
        this.klasses = KLASSES;
        // TODO: messy
        statsService.stats.subject.subscribe(
            (stats: LifetimeStats) => {
                this.checkUnlocks(stats);
            }
        );
    }

    private checkUnlocks(stats: LifetimeStats) {
        for (let klass of this.klasses) {
            // You can never 'un-unlock' a class
            if (klass.unlocked) {
                continue;
            }
            klass.unlocked = klass.criteria(stats);
            if (klass.unlocked) {
                this.ticker.logUnlock(`Unlocked a new class: ${klass.name}!`);
            }
        }
    }
}
