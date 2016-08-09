import { mostlyUniformSkillMap, uniformSkillMap, SkillType } from '../skills/index';
import { LifetimeStats } from '../stats/index';
import { Klass } from './klass.interface';

export const KLASSES : Klass[] =[
    {
        name: 'Peasant',
        aptitudes: uniformSkillMap(.5),
        criteria: (s: LifetimeStats) => { return true; },
    },
    {
        name: 'Farmer',
        aptitudes: mostlyUniformSkillMap(.5, 
                        {
                            [SkillType.Farming]: 1.3,
                            [SkillType.Survival]: .9
                        }),
        criteria: (s: LifetimeStats) => { return s.maxSkillLevel[SkillType.Farming] >= 10 },
    },
    {
        name: 'Student',
        aptitudes: mostlyUniformSkillMap(.7, {[SkillType.Intellect]: 1.1}),
        criteria: (s: LifetimeStats) => { return s.actionsTaken >= 10 },
    },
]

