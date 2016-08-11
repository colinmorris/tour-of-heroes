import { Injectable } from '@angular/core';

import { KlassService } from '../klasses/klass.service';
import { PerkService } from '../perks/perk.service';
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
        private perks: PerkService
    ) {
        let klass = klasses.starterKlass;
        let aptitudes = klasses.aptitudesForKlass(klass);
        this.player = Player.newborn("Coolin", klass, aptitudes);
        this.perks.addPerkForKlass(this.player.klass);
    }

    getSkillLevel(s: SkillType) : number {
        // TODO: raw vs. buffed
        return this.player.skills[s].level;
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
