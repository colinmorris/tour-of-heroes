import { Skill, RawSkill } from './skill.interface';
import { Progressive } from '../shared/progressive.interface';
import { Subject } from 'rxjs/Subject';

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

    /** A dummy subject that broadcasts when there's a 'significant' change to
    the player's skills, defined as:
    - a skill going up a level
    - a skill level being buffed
    (but not just gaining points, and not changes to apts.)
    TODO: Is there a more idiomatic way to do this?
    **/
    skillChange$: Subject<any>;
}
