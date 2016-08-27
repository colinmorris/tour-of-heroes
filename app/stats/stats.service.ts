import { Injectable } from '@angular/core';
import { IStatsService } from './stats.service.interface';
import { SkillType, SkillMap, SkillMapOf, uniformSkillMap,
    Stat, NamedUnlock, OneShotAction
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
            // TODO: Come up with some nice, general, low-maintenance way of
            // healing version mismatches
            // XXX: Compat hack. Remove later.
            if (!this.stats.klassUnlocks) {
                this.stats.klassUnlocks = <{[klass:string] : any}>{};
            }
            if (!this.stats.currSkillLevels) {
                this.stats.currSkillLevels = uniformSkillMap(0);
            }
        } else {
            this.stats = this.freshStats();
        }
        serials.saveSignaller.subscribe( () => {
            serials.saveStats(this.stats);
        });
    }

    private freshStats() : StatsData {
        let stats:StatsData = {
           simpleStats: new Array<StatCell>(),
           oneShots: new Array<boolean>(),
           unlocks: new Array<boolean>(),
           klassUnlocks: <{[klass:string] : any}>{},
           klassLevels: <{[klass:string] : number}>{},
           currSkillLevels: uniformSkillMap(0),
           skillLevels: uniformSkillMap(0),
           actionStats: <{[zone: string] : StatCell}>{}
       };
        for (let s = 0; s < Stat.MAX; s++) {
            stats.simpleStats[s] = {current: 0, sum: 0};
        }
        for (let s = 0; s < NamedUnlock.MAX; s++) {
            stats.unlocks[s] = false;
        }
        for (let s = 0; s < OneShotAction.MAX; s++) {
            stats.oneShots[s] = false;
        }
        return stats;
    }

    // ----------------------- Write --------------------------------
    setSkills(levels: SkillMap) {
        for (let i=0; i < SkillType.MAX; i++) {
            this.stats.currSkillLevels[i] = levels[i];
            this.stats.skillLevels[i] = Math.max(levels[i],
                this.stats.skillLevels[i]);
        }
    }
    /** Should only be called on reincarnation to avert a nasty bug with
    heroic ancestry buff. Unfortunately, this behaviour introduces a new,
    not-quite-as-bad bug where class unlock conditions like "reach level X
    as class Y" won't be acknowledged until reincarnation. Could keep two
    trackers if that really matters.
    **/
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
    crittedAction() {
        this.incrementSimpleStat(Stat.CriticalActions)
    }
    clicked() {
        this.incrementSimpleStat(Stat.Clicks);
    }
    actionTaken(zone: string) {
        this.incrementSimpleStat(Stat.ActionsTaken);
        if (!(zone in this.stats.actionStats)) {
            this.stats.actionStats[zone] = {current: 0, sum: 0};
        }
        this.incrementStatCell(this.stats.actionStats[zone]);
    }
    reincarnated() {
        this.incrementSimpleStat(Stat.Reincarnations);
        this.resetEphemeralStats();
    }
     incrementSimpleStat(stat: Stat) {
        this.incrementStatCell(this.stats.simpleStats[stat]);
    }
     incrementStatCell(cell: StatCell) {
        cell.current += 1;
        cell.sum += 1;
    }
    /** Resets to zero all stats that describe the current lifetime. Called on
    reincarnation. **/
    private resetEphemeralStats() {
        for (let s=0; s<Stat.MAX; s++) {
            this.stats.simpleStats[s].current = 0;
        }
        for (let s=0; s<SkillType.MAX; s++) {
            this.stats.currSkillLevels[s] = 0;
        }
    }
    unlock(u: NamedUnlock) {
        if (!this.stats.unlocks[u]) {
            console.log(`New named unlock! ${NamedUnlock[u]}`);
        }
        this.stats.unlocks[u] = true;
    }
    setClassUnlocked(klass: string) {
        this.stats.klassUnlocks[klass] = true;
    }
    setOneShot(oneshot: OneShotAction) {
        this.stats.oneShots[oneshot] = true;
    }

    // ----------------------- Read --------------------------------
    current(s: Stat) {
        if (!(s in this.stats.simpleStats)) {
            console.warn(`Couldn't find ${s} in simpleStats. Save version
            incompatibility? Adding an empty cell for it.`);
            if (s > this.stats.simpleStats.length) {
                console.error("TODO: Ugh I should fix this.");
            }
            this.stats.simpleStats[s] = {current: 0, sum: 0};
        }
        return this.stats.simpleStats[s].current;
    }
    lifetimeSum(s: Stat) {
        if (!(s in this.stats.simpleStats)) {
            console.warn(`Couldn't find ${s} in simpleStats. Save version
            incompatibility? Adding an empty cell for it.`);
            if (s > this.stats.simpleStats.length) {
                console.error("TODO: Ugh I should fix this.");
            }
            this.stats.simpleStats[s] = {current: 0, sum: 0};
        }
        return this.stats.simpleStats[s].sum;
    }
    classUnlocked(klass: string) : boolean {
        return klass in this.stats.klassUnlocks;
    }
    unlocked(u: NamedUnlock) {
        return this.stats.unlocks[u];
    }
    performedOneShot(oneshot: OneShotAction) {
        return this.stats.oneShots[oneshot];
    }
    playerLevel(klass: string) {
        return this.stats.klassLevels[klass] || 0;
    }
    maxLevelPerKlass() : {[klass:string] : number} {
        return this.stats.klassLevels;
    }
    maxLevels() : number[] {
        let levels = new Array<number>();
        for (let klass in this.stats.klassLevels) {
            levels.push(this.stats.klassLevels[klass]);
        }
        return levels;
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
    /** We have some unlock conditioned on reaching level X in skill Y.
        If we've already done so (in any lifetime), return True. Otherwise,
        return a number in [0,1) describing our progress with respect to our
        *current* skill levels (not lifetime max). This is a more helpful number
        to show to the player.
    **/
    checkSkillUnlock(skill: SkillType, threshold: number) : (boolean | number) {
        if (this.stats.skillLevels[skill] >= threshold) {
            return true;
        } else {
            return this.stats.currSkillLevels[skill] / threshold;
        }
    }


}
