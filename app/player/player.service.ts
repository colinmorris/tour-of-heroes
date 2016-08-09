// We're really trying this, huh?

import { Injectable } from '@angular/core';

import { KlassService } from '../klasses/klass.service';

import { Player, newbornPlayerSkills } from '../core/index';

type KlassType = string;
type SkillType = number;

@Injectable()
export class PlayerService {
    player: Player;

    constructor(
        private klasses: KlassService
    ) {
        let klass = klasses.starterKlass;
        let aptitudes = klasses.aptitudesForKlass(klass);
        this.player = {
            name: "Coolin",
            level: 1,
            klass: klass,
            skills: newbornPlayerSkills(aptitudes)
        };
    }

    reincarnate(klass: KlassType) { }

    trainSkill(skill: SkillType, points: number) {
        // Any perks applying to particular zones/items need to be applied upstream
    }

    percentProgress() {
        return 50;
    }
}
