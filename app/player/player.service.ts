import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NotificationsService } from 'angular2-notifications';

import { KlassService } from '../klasses/klass.service';
import { StatsService } from '../stats/stats.service';
import { SerializationService } from '../shared/serialization.service';

import { LivePlayer } from './player';
import { Player, RawPlayer } from './player.interface';
import { IPlayerService } from './player.service.interface';
import { Skill } from './skill.interface';
import { GLOBALS } from '../globals';

import {
    SkillMap,
    mostlyUniformSkillMap, zeroSkillMap
} from '../core/index';

type KlassType = string;
type SkillType = number;

@Injectable()
export class PlayerService implements IPlayerService {
    private _player: LivePlayer;
    public playerLevel$ : Observable<number>;

    constructor(
        private klasses: KlassService,
        private stats: StatsService,
        private Toasts: NotificationsService,
        private serials: SerializationService
    ) {
        let saved:RawPlayer = serials.loadPlayer();
        let player:LivePlayer;
        if (saved && GLOBALS.loadSaves) {
            player = LivePlayer.fromJSON(saved);
        } else {
            console.log("Starting fresh");
            player = this.startingPlayer();
        }
        this.setPlayer(player);

        serials.saveSignaller.subscribe( () => {
            serials.savePlayer(this.toJSON());
        });
    }

    get player() : Player {
        return this._player;
    }

    private startingPlayer() : LivePlayer {
        let klass = this.klasses.starterKlass;
        let aptitudes = this.klasses.aptitudesForKlass(klass);
        return LivePlayer.newborn("Coolin", klass, aptitudes);
    }

    // Called on service init and on reincarnation.
    private setPlayer(player: LivePlayer) {
        this._player = player;
        this.playerLevel$ = this._player.level$.asObservable();
        this.playerLevel$.subscribe( (lvl) => {
            // Actually won't do this until reincarnation.
            //this.stats.setLevel(lvl, this._player.klass);
            // TODO: This is lazy. Simple solution would be to just have
            // player publish to level$ whenever skill levels go up
            this.stats.setSkills(this._player.baseSkillLevels());
        });
        // This is a pretty arbitrary place to put this.
        // Also, this is pretty hacky. But tested and seems to work.
        let first = true;
        this.playerLevel$.subscribe( (lvl) => {
            if (first) {
                first = false;
            } else if (lvl >= GLOBALS.zoneLevelingMinLevel && (lvl % 5) == 0) {
                console.log("You earned a Zi token. Yay.");
                this.stats.ziTokens++;
                this.Toasts.info(
                    `Level ${lvl}`,
                    `Gained a Zone Improvement token`
                );
            }
        });
    }

    toJSON() : RawPlayer {
        return this._player.toJSON();
    }

    // ---------------------- Accessors -------------------------

    getSkillLevel(s: SkillType) : number {
        return this._player.skills[s].level;
    }
    getSkillLevels() : SkillMap {
        return this._player.skills.map( (skill) => {
            return skill.level;
        });
    }
    getBaseAptitudes() : SkillMap {
        return this._player.skills.map( (s: Skill) => {
            return s.baseAptitude;
        })
    }
    canLevelZones() : boolean {
        return this._player.level >= GLOBALS.zoneLevelingMinLevel;
    }

    // ---------------------- Mutators -------------------------

    buffAptitudes(by: SkillMap) {
        this._player.buffAptitudes(by);
    }
    debuffAptitudes(by: SkillMap) {
        this._player.buffAptitudes( by.map( (apt)=>-1*apt ) );
    }

    buffSkillLevels(by: SkillMap) {
        this._player.buffSkillLevels(by);
    }
    buffSkillLevel(skill: SkillType, levels: number) {
        let buffs = mostlyUniformSkillMap(0, {[skill]: levels});
        this.buffSkillLevels(buffs);
    }

    trainSkills(basePoints: SkillMap) : SkillMap {
        return this._player.applySkillPoints(basePoints);
    }
    trainSkill(skill: SkillType, basePoints: number) : SkillMap {
        let sp = zeroSkillMap();
        sp[skill] = basePoints;
        return this.trainSkills(sp);
    }

    reincarnate(klass: KlassType) {
        let aptitudes = this.klasses.aptitudesForKlass(klass);
        let player = LivePlayer.newborn("Coolin", klass, aptitudes);
        this.setPlayer(player);
    }

}
