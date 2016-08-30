import { SkillType } from './skills/skilltype.enum';

export function randomChoice<T>(arr:Array<T>) : T {
    console.assert(arr.length > 0);
    let index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

export function formatPct(num: number, decimalPlaces=0) : string {
    return (num*100).toFixed(decimalPlaces) + '%';
}

export function randomSkill() : SkillType {
    return Math.floor(Math.random() * SkillType.MAX);
}
