import { mostlyUniformSkillMap, uniformSkillMap, SkillType } from '../skills/index';
import { IStatsService } from '../../stats/stats.service.interface';
import { Klass } from './klass.interface';
import { Stat, NamedUnlock as NU } from '../stats/index';

let low_skill_lvl = 10;
let med_skill_lvl = 25;
let hi_skill_lvl = 50;

// TODO: Specify perks here
export const KLASSES : Klass[] =[
    {
        // perk: double apts until level 10
        name: 'Peasant',
        aptitudes: uniformSkillMap(.5),
        img: 'ruffian.png',
        criteria: (s: IStatsService) => true
    },
    {
        name: 'Farmer',
        aptitudes: mostlyUniformSkillMap(.5,
                        {
                            [SkillType.Farming]: 1.3,
                            [SkillType.Survival]: .9,
                            [SkillType.Riding]: 1.0
                        }),
        img: 'peasant.png',
        criteria: (s: IStatsService) => {
            return s.skillLevel(SkillType.Farming) >= low_skill_lvl;
        }
    },
    {
        name: 'Student',
        aptitudes: mostlyUniformSkillMap(.7, {[SkillType.Intellect]: 1.1}),
        img: 'mage.png',
        criteria: (s: IStatsService) => {
            return s.current(Stat.ActionsTaken) >= 10;
        }
    },
    {
        name: 'Assassin',
        aptitudes: mostlyUniformSkillMap(.7, {
            [SkillType.Stealth]: 1.5,
            [SkillType.Intellect]: 1.2,
            [SkillType.Combat]: .9
        }),
        img: 'assassin+female.png',
        criteria: (s: IStatsService) => {
            return s.skillLevel(SkillType.Stealth) >= med_skill_lvl;
        }
    },
    {
        name: 'Cleric',
        aptitudes: mostlyUniformSkillMap(.7, {
            [SkillType.Piety]: 1.5,
            [SkillType.Combat]: 0.4,
            [SkillType.Survival]: 0.6,
            [SkillType.Intellect]: 1.0
        }),
        img: 'white-mage.png',
        criteria: (s: IStatsService) => {
            return s.unlocked(NU.Pacifist);
        }
    },
    {
        name: 'Berserker',
        aptitudes: mostlyUniformSkillMap(.8, {
            [SkillType.Combat]: 1.6,
            [SkillType.Charm]: .6,
            [SkillType.Intellect]: .5,
            [SkillType.Stealth]: .5,
            [SkillType.Survival]: .9
        }),
        img: 'berserker.png',
        criteria: (s: IStatsService) => {
            /** TODO: Maybe criteria should be something like complete X actions
            in Y seconds? **/
            // Let's just use a simple placeholder for now
            return s.skillLevel(SkillType.Combat) > low_skill_lvl;
        }
    },
    {
            name: 'Skeleton',
            aptitudes: mostlyUniformSkillMap(.7, {
                [SkillType.Stealth]: .5,
                [SkillType.Piety]: .5,
                [SkillType.Survival]: 1.0
            }),
            img: 'skeleton.png',
            criteria: (s: IStatsService) => {
                return s.lifetimeSum(Stat.Clicks) > 5;
            }
    },
    {
        name: 'Gladiator',
        aptitudes: mostlyUniformSkillMap(.7, {
            [SkillType.Combat]: 1.2,
            [SkillType.Charm]: 1.2,
            [SkillType.Farming]: .6,
            [SkillType.Piety]: .6
        }),
        img: 'pikeman.png',
        criteria: (s: IStatsService) => {
            return s.lifetimeSumActionsTaken('Colloseum') > 3;
        }
    },
    {
        name: 'Scholar',
        aptitudes: mostlyUniformSkillMap(.9, {[SkillType.Intellect]: 1.5}),
        img: 'red-mage.png',
        criteria: (s: IStatsService) => {
            return s.playerLevel('Student') >= 20;
        }
    },
    {
        name: 'Horseman',
        aptitudes: mostlyUniformSkillMap(.7, {
            [SkillType.Riding]: 1.3,
            [SkillType.Combat]: 0.9,
            [SkillType.Stealth]: 0.5,
            [SkillType.Survival]: 0.8
        }),
        img: 'horseman.png',
        criteria: (s: IStatsService) => {
            return s.lifetimeSumActionsTaken('Stables') > 3;
        }
    }

    // TODO: needs a perk
    // {
    //     name: 'Mage',
    //     aptitudes: mostlyUniformSkillMap(.7, {
    //         [SkillType.Intellect]: 1.1,
    //         [SkillType.Combat]: 1.1,
    //     }),
    //     img: 'elder-mage.png',
    //     criteria: (s: IStatsService) => {
    //         let thresh = low_skill_lvl;
    //         return (s.skillLevel(SkillType.Intellect) > thresh) &&
    //             (s.skillLevel(SkillType.Combat) > thresh);
    //     }
    // }

]
