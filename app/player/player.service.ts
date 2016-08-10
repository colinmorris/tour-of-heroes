import { Injectable } from '@angular/core';

import { KlassService } from '../klasses/klass.service';
import { Zones } from '../zones/zones.service';
import { Player } from './player';

import { PlayerOutcome, PlayerEffect,
    ActionEffect,
    SkillMap, zeroSkillMap, getTruthySkills
} from '../core/index';

type KlassType = string;
type SkillType = number;

@Injectable()
export class PlayerService {
    player: Player;

    constructor(
        private klasses: KlassService,
        private zones: Zones
    ) {
        let klass = klasses.starterKlass;
        let aptitudes = klasses.aptitudesForKlass(klass);
        this.player = Player.newborn("Coolin", klass, aptitudes);
    }

    applyEffect(effect: PlayerEffect) : PlayerOutcome {
        let outcome: PlayerOutcome = {};
        if (effect.skillPoints) {
            outcome.pointsGained = this.applySkillPoints(effect.skillPoints);
        }
        if (effect.item) {
            // TODO
            console.error("Applying item effects not implemented yet");
        }
        return outcome;
    }

    private applySkillPoints(points: SkillMap) : SkillMap {
        let gains: SkillMap = zeroSkillMap();
        for (let skill of getTruthySkills(points)) {
            gains[skill] = this.player.skills[skill].train(points[skill]);
        }
        return gains;
    }

    reincarnate(klass: KlassType) {
        this.zones.resetActiveZone();
        // TODO
    }

    trainSkill(skill: SkillType, points: number) {
        // Any perks applying to particular zones/items need to be applied upstream
        // TODO
    }
}
