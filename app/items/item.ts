import { SkillType } from '../core/index';

export interface Item {

    name: string;
    description: string;

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
}
