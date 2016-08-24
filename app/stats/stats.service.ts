import { Injectable } from '@angular/core';
import { IStatsService } from './stats.service.interface';
import { SkillType, SkillMap, SkillMapOf, uniformSkillMap,
    Stat, NamedUnlock
 } from '../core/index';
import { SerializationService } from '../shared/serialization.service';
import { StatsData, StatCell } from './stats-data.interface';
import { GLOBALS } from '../globals';

@Injectable()
export class StatsService implements IStatsService {
    // This makes serialization/deserialization a lot easier
    private stats: StatsData;

    constructor(
         serials: SerializationService
    ) {
        let saved:StatsData = serials.loadStats();
        if (saved && GLOBALS.loadSaves) {
            this.stats = saved;
        } else {
            this.stats = this.freshStats();
        }
        serials.saveSignaller.subscribe( () => {
            serials.saveStats(this.stats);
        })
    }

    private freshStats() : StatsData {
        let stats:StatsData = {
           simpleStats: new Array<StatCell>(),
           unlocks: new Array<boolean>(),
           klassLevels: <{[klass:string] : number}>{},
           skillLevels: uniformSkillMap(0),
           actionStats: <{[zone: string] : StatCell}>{}
       };
        for (let s = 0; s < Stat.MAX; s++) {
            stats.simpleStats[s] = {current: 0, sum: 0};
        }
        for (let s = 0; s < NamedUnlock.MAX; s++) {
            stats.unlocks[s] = false;
        }
        return stats;
    }

    // ----------------------- Write --------------------------------
    setSkills(levels: SkillMap) {
        for (let i=0; i < SkillType.MAX; i++) {
            this.stats.skillLevels[i] = Math.max(levels[i],
                this.stats.skillLevels[i]);
        }
    }
    setLevel(level: number, klass: string) {
        let simple = this.stats.simpleStats[Stat.PlayerLevel];
        simple.sum += (level - simple.current);
        simple.current = level;
        this.stats.klassLevels[klass] = Math.max(level, this.stats.klassLevels[klass] || 0);
    }
    spellCast() {
        this.incrementSimpleStat(Stat.SpellsCast);
    }
    itemFound() {

    }
    clicked() {

    }
    actionTaken(zone: string) {
        this.incrementSimpleStat(Stat.ActionsTaken);
        if (!(zone in this.stats.actionStats)) {
            this.stats.actionStats[zone] = {current: 0, sum: 0};
        }
        this.incrementStatCell(this.stats.actionStats[zone]);
    }
     incrementSimpleStat(stat: Stat) {
        this.incrementStatCell(this.stats.simpleStats[stat]);
    }
     incrementStatCell(cell: StatCell) {
        cell.current += 1;
        cell.sum += 1;
    }
    unlock(u: NamedUnlock) {
        this.stats.unlocks[u] = true;
    }

    // ----------------------- Read --------------------------------
    current(s: Stat) {
        return this.stats.simpleStats[s].current;
    }
    lifetimeSum(s: Stat) {
        return this.stats.simpleStats[s].sum;
    }
    unlocked(u: NamedUnlock) {
        return this.stats.unlocks[u];
    }
    playerLevel(klass: string) {
        return this.stats.klassLevels[klass];
    }
    maxLevelPerKlass() : {[klass:string] : number} {
        return this.stats.klassLevels;
    }
    skillLevel(skill: SkillType) {
        return this.stats.skillLevels[skill];
    }
    actionsTaken(zone: string) {
        if (!(zone in this.stats.actionStats)) {
            return 0;
        }
        return this.stats.actionStats[zone].current;
    }
    lifetimeSumActionsTaken(zone: string) {
        if (!(zone in this.stats.actionStats)) {
            return 0;
        }
        return this.stats.actionStats[zone].sum;
    }


}
