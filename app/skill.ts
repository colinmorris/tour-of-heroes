export class Skill {
    name : string;
    level: number;
    aptitude: number;
}

export enum SkillType {
    Farming = 1,
    Combat,
    Woodcutting,
    Dance
}

export const SKILLNAMES : string[] = [
    "Farming",
    "Combat",
    "Woodcutting",
    "Dance"
]
