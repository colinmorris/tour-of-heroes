import { mostlyUniformSkillMap, uniformSkillMap, SkillType } from '../skills/index';
import { IStatsService, Stat } from '../../stats/stats.service.interface';
import { Klass } from './klass.interface';

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
                            [SkillType.Survival]: .9
                        }),
        img: 'peasant.png',
        criteria: (s: IStatsService) => { return s.skillLevel(SkillType.Farming) >= 10 },
    },
    {
        name: 'Student',
        aptitudes: mostlyUniformSkillMap(.7, {[SkillType.Intellect]: 1.1}),
        img: 'mage.png',
        criteria: (s: IStatsService) => {
            return s.current(Stat.ActionsTaken) >= 10;
        },
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
            let thresh = 10;
            return (s.skillLevel(SkillType.Intellect) > thresh) &&
                (s.skillLevel(SkillType.Combat) > thresh);
        }
    }

]
