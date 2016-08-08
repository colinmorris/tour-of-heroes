import { Injectable, forwardRef, Inject } from '@angular/core';
import { LifetimeStats } from './stats.model';
import { PlayerService }  from "../player";
import { SkillType }  from "../skills";

@Injectable()
export class StatsService {

    stats: LifetimeStats = new LifetimeStats();

    constructor(
        @Inject(forwardRef(() => PlayerService)) private PS: PlayerService
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
