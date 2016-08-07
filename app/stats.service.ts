import { Injectable } from '@angular/core';
import { LifetimeStats } from './stats';
import { PlayerService }  from "./player.service";
import { SkillType }  from "./skill.data";

@Injectable()
export class StatsService {

    stats: LifetimeStats = new LifetimeStats();

    constructor(
        private PS: PlayerService
    ) {
        // TODO: Maybe nicer interface?
        PS.levelSubject.subscribe(
            (level:number) => { this.stats.onLevelChange(level, PS.chara.klass.name);}
        );
        PS.skillSubject.subscribe(
            (tup:[SkillType,number]) => { this.stats.onSkillLevelChange(tup); }
        );
    }

    actionTaken() {
        this.stats.actionsTakenThisLifetime++;
    }
}
