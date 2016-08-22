import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { KlassService } from '../klasses/klass.service';
import { PerkService } from '../perks/perk.service';
import { StatsService } from '../stats/stats.service';
import { SerializationService } from '../shared/serialization.service';

import { LivePlayer } from './player';
import { Player, RawPlayer } from './player.interface';
import { IPlayerService } from './player.service.interface';
import { Skill } from './skill.interface';
import { GLOBALS } from '../globals';

import {
    SkillMap,
    mostlyUniformSkillMap
} from '../core/index';

type KlassType = string;
type SkillType = number;

@Injectable()
export class PlayerService implements IPlayerService {
    private _player: LivePlayer;
    playerLevel$ : Observable<number>;

    constructor(
        private klasses: KlassService,
        private perks: PerkService,
        private stats: StatsService,
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
        this.setPlayer(player, true);

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
    private setPlayer(player: LivePlayer, defer=false) {
        this._player = player;
        this.playerLevel$ = this._player.level$.asObservable();
        this.playerLevel$.subscribe( (lvl) => {
            this.stats.setLevel(lvl, this._player.klass);
            // TODO: This is lazy. Simple solution would be to just have
            // player publish to level$ whenever skill levels go up
            this.stats.setSkills(this._player.baseSkillLevels());
        });
        this.perks.addPerkForKlass(this.player.klass, defer);
        this.perks.addAncestryPerk(defer);
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

    // ---------------------- Mutators -------------------------

    buffAptitudes(by: SkillMap) {
        this._player.buffAptitudes(by);
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

    reincarnate(klass: KlassType) {
        let aptitudes = this.klasses.aptitudesForKlass(klass);
        let player = LivePlayer.newborn("Coolin", klass, aptitudes);
        this.setPlayer(player);
    }

}
