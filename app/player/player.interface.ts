import { Skill, RawSkill } from './skill.interface';
import { Progressive } from '../shared/progressive.interface';

// TODO: move all this junk to core?

export interface RawPlayer {
    name: string;
    klass: string;
    level: number;
    skills: RawSkill[];
}

export class PlayerMetadata {
    clickMultiplier: number = 1.0;
    clickCritRate: number = 0;
    clickCritMultiplier: number = 2.0;
    critChance: number = 0;
    critMultiplier: number = 2.0;
}

export interface Player extends RawPlayer, Progressive {
    skills: Skill[];
    /** It turns out that the Player is sort of the ideal place to store
    various game-altering bits of metadata of interest to perks, because
    it's guaranteed to go away on reincarnation. Whereas if they stored these
    bits in service properties, they'd have to be careful to undo their changes
    on reincarnation. **/
    meta: PlayerMetadata;
}
