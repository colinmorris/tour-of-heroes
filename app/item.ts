import { SkillType, uniformSkillMap } from './skill';
import { GameService } from './game.service';
import { Kicker } from './perk';

export function randomDrop() : Kicker {
    let randSkill = SkillType.Dance;
    let item : Item = new Manual(randSkill);
    return {description: `You found a ${item.name}`, skillDelta: uniformSkillMap<number>(0),
        item: item};
}

export interface Item {

    name: string;
    description: string;

    applyItem(game: GameService);
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

    applyItem(game: GameService) {
        // TODO: scaling effect
        game.trainSkill(this.skill, 100);
    }
}
