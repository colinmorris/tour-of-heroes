import { Injectable } from '@angular/core';
import { IStatsService,
    Stat, NamedUnlock
 } from './stats.service.interface';
 import { SkillType, SkillMap, SkillMapOf } from '../core/index';

interface StatCell {
    current: number;
    sum: number;
}

@Injectable()
export class StatsService implements IStatsService {
    private simpleStats : StatCell[] = new Array<StatCell>();
    private unlocks: boolean[] = new Array<boolean>();
    // Map from klass to name to max plvl attained
    private klassLevels: {[klass:string] : number} = <{[klass:string] : number}>{};
    private skillLevels: SkillMapOf<number>;
    private actionStats: {[zone: string] : StatCell} = <{[zone: string] : StatCell}>{};
    constructor() {
        for (let s = 0; s < Stat.MAX; s++) {
            this.simpleStats[s] = {current: 0, sum: 0};
        }
        for (let s = 0; s < NamedUnlock.MAX; s++) {
            this.unlocks[s] = false;
        }
    }

    // ----------------------- Write --------------------------------
    setSkills(levels: SkillMap) {
        this.skillLevels = levels;
    }
    setLevel(level: number, klass: string) {
        let simple = this.simpleStats[Stat.PlayerLevel];
        simple.sum += (level - simple.current);
        simple.current = level;
        this.klassLevels[klass] = Math.max(level, this.klassLevels[klass] || 0);
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
        if (!(zone in this.actionStats)) {
            this.actionStats[zone] = {current: 0, sum: 0};
        }
        this.incrementStatCell(this.actionStats[zone]);
    }
    private incrementSimpleStat(stat: Stat) {
        this.incrementStatCell(this.simpleStats[stat]);
    }
    private incrementStatCell(cell: StatCell) {
        cell.current += 1;
        cell.sum += 1;
    }

    // ----------------------- Read --------------------------------
    current(s: Stat) {
        return this.simpleStats[s].current;
    }
    lifetimeSum(s: Stat) {
        return this.simpleStats[s].sum;
    }
    unlocked(u: NamedUnlock) {
        return this.unlocks[u];
    }
    playerLevel(klass: string) {
        return this.klassLevels[klass];
    }
    maxLevelPerKlass() : {[klass:string] : number} {
        return this.klassLevels;
    }
    skillLevel(skill: SkillType) {
        return this.skillLevels[skill];
    }
    actionsTaken(zone: string) {
        if (!(zone in this.actionStats)) {
            return 0;
        }
        return this.actionStats[zone].current;
    }
    lifetimeSumActionsTaken(zone: string) {
        if (!(zone in this.actionStats)) {
            return 0;
        }
        return this.actionStats[zone].sum;
    }


}
