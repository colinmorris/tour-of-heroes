import { GLOBALS } from './globals';

export class Skill {
    constructor(
        public id: number,
        public name: string,
        // starting from 0
        public level: number,
        public aptitude: number,
        public skillPoints: number
    ){}

    train(points: number) : number {
        let newTotal = this.skillPoints + (points * this.aptitude);
        let thresh = this.pointsForNextLevel();
        let delta = 0;
        while (newTotal >= thresh) {
            this.level++;
            delta++;
            newTotal -= thresh;
            thresh = this.pointsForNextLevel();
        }
        this.skillPoints = newTotal;
        return delta;
    }

    pointsForNextLevel() : number {
        return Skill.pointsForNextLevel(this.level);
    }

    static pointsForNextLevel(level: number) : number {
        // 100, 200, 400, etc. probably too steep
        return GLOBALS.skillLevelBaseCost * Math.pow(2, level);
    }

    percentProgress() : number {
        return 100 * (this.skillPoints / this.pointsForNextLevel());
    }

}

// TODO: At some point, probably want to refactor this into actual class
// just to hold ancilliary data like descriptions etc.
export enum SkillType {
    Farming = 0,
    Combat,
    Woodcutting,
    Dance,
    Intellect,
    Charm,
    Stealth,
    MAX,
}

export type SkillMapOf<T> = Array<T>;
export type SkillMap = SkillMapOf<number>; 

function JSONtoSkillMapFactory<T>() : (Object) => SkillMapOf<T> {
    return (j: Object) => {
    let tees : T[] = new Array<T>(SkillType.MAX);
    for (let skillId=0; skillId < SkillType.MAX; skillId++) {
        if (j.hasOwnProperty(skillId)) {
            tees[skillId] = j[skillId];
        } else {
            // tees[skillId] = undefined; // probably redundant?
        }
    }
    return tees;
    }
}
function JSONtoSkillMapOf<T>(j: Object) : SkillMapOf<T> {
    return JSONtoSkillMapFactory<T>()(j);
}

export let JSONtoSkillMap: (Object) => SkillMap = JSONtoSkillMapFactory<number>();

export function skillMapFromFactory<T>(initFactory: (number) => T) : SkillMapOf<T> {
    let tees : T[] = new Array<T>(SkillType.MAX);
    for (let skillId=0; skillId < SkillType.MAX; skillId++) {
        tees[skillId] = initFactory(skillId);
    }
    return tees;
}

export function uniformSkillMap<T>(repeatedValue : T) : SkillMapOf<T> { 
    return skillMapFromFactory<T>( (s:number) => { return repeatedValue; } );
}

export function mostlyUniformSkillMap<T>(repeatedValue: T, exceptions: Object) {
    let tees : T[] = new Array<T>(SkillType.MAX);
    for (let skillId=0; skillId < SkillType.MAX; skillId++) {
        if (exceptions.hasOwnProperty(skillId)) {
            tees[skillId] = exceptions[skillId];
        } else {
            tees[skillId] = repeatedValue;
        }
    }
    return tees;
}

export function truthySkills( sm: SkillMapOf<any>, callback: (s: SkillType, v:any) => void) {
    for (let skillId=0; skillId < SkillType.MAX; skillId++) {
        let value = sm[skillId];
        if (value) {
            callback(skillId, value);
        }
    }
}

export function getTruthySkills( sm: SkillMapOf<any>) : SkillType[] {
    let skills: SkillType[] = new Array<SkillType>();
    for (let skillId=0; skillId < SkillType.MAX; skillId++) {
        let value = sm[skillId];
        if (value) {
            skills.push(skillId);
        }
    }
    return skills;
}
