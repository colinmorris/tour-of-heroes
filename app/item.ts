import { SkillType, uniformSkillMap } from './skill.data';
import { PlayerService } from './player.service';


export interface Item {

    name: string;
    description: string;

    applyItem(game: PlayerService);
}

export interface UseableItem extends Item {
    // blah blah
}

export class Manual implements UseableItem {
    name: string;
    description: string;
    constructor(
        public skill: SkillType
    ) {
        this.name = `Manual of ${SkillType[skill]}`;
        this.description = `A book that gives skill points when used`;
    }

    applyItem(game: PlayerService) {
        // TODO: scaling effect
        game.trainSkill(this.skill, 100);
    }
}
