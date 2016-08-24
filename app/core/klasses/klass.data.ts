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
            return true;
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
        name: 'Mage',
        aptitudes: mostlyUniformSkillMap(.7, {
            [SkillType.Intellect]: 1.1,
            [SkillType.Combat]: 1.1,
        }),
        img: 'elder-mage.png',
        criteria: (s: IStatsService) => {
            let thresh = low_skill_lvl;
            return (s.skillLevel(SkillType.Intellect) > thresh) &&
                (s.skillLevel(SkillType.Combat) > thresh);
        }
    }

]
