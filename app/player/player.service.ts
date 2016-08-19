import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { KlassService } from '../klasses/klass.service';
import { PerkService } from '../perks/perk.service';
import { StatsService } from '../stats/stats.service';
import { LivePlayer } from './player';
import { Player } from './player.interface';
import { IPlayerService } from './player.service.interface';
import { Skill } from './skill.interface';

import { PlayerOutcome, PlayerEffect,
    ActionEffect,
    SkillMap
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
        private stats: StatsService
    ) {
        let klass = klasses.starterKlass;
        let aptitudes = klasses.aptitudesForKlass(klass);
        let player = LivePlayer.newborn("Coolin", klass, aptitudes);
        this.setPlayer(player);
        // In the case of reincarnation, this is called by the component
        this.perks.addPerkForKlass(this.player.klass, true);
    }

    get player() : Player {
        return this._player;
    }

    // Called on service init and on reincarnation.
    private setPlayer(player: LivePlayer) {
        this._player = player;
        this.playerLevel$ = this._player.level$.asObservable();
        this.playerLevel$.subscribe( (lvl) => {
            this.stats.setLevel(lvl, this._player.klass);
            // TODO: This is lazy. Simple solution would be to just have
            // player publish to level$ whenever skill levels go up
            this.stats.setSkills(this._player.baseSkillLevels());
        });
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

    applyEffect(effect: PlayerEffect) : PlayerOutcome {
        let outcome: PlayerOutcome = {};
        if (effect.skillPoints) {
            outcome.pointsGained = this._player.applySkillPoints(effect.skillPoints);
        }
        if (effect.item) {
            // TODO
            console.error("Applying item effects not implemented yet");
        }
        return outcome;
    }

    reincarnate(klass: KlassType) {
        let aptitudes = this.klasses.aptitudesForKlass(klass);
        let player = LivePlayer.newborn("Coolin", klass, aptitudes);
        this.setPlayer(player);
    }

    trainSkill(skill: SkillType, points: number) {
        // Any perks applying to particular zones/items need to be applied upstream
        // TODO
    }
}
