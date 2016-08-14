import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { KlassService } from '../klasses/klass.service';
import { PerkService } from '../perks/perk.service';
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
        private perks: PerkService
    ) {
        let klass = klasses.starterKlass;
        let aptitudes = klasses.aptitudesForKlass(klass);
        this._player = LivePlayer.newborn("Coolin", klass, aptitudes);
        this.playerLevel$ = this._player.level$.asObservable();
        this.perks.addPerkForKlass(this.player.klass, true);
    }

    get player() : Player {
        return this._player;
    }

    // ---------------------- Accessors -------------------------

    getSkillLevel(s: SkillType) : number {
        // TODO: raw vs. buffed
        return this._player.skills[s].level;
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
        // Should probably be up to the component to notify other services
        // (e.g. actionservice) to clean their shit up. To do it from here
        // would be a bad separation of concerns.
        // TODO
    }

    trainSkill(skill: SkillType, points: number) {
        // Any perks applying to particular zones/items need to be applied upstream
        // TODO
    }
}
