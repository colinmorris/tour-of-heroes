import { mostlyUniformSkillMap, uniformSkillMap, SkillType } from './skill';
import { LifetimeStats } from './stats';
import { Klass } from './klass';

export const KLASSES = new Array<Klass>();

let klassData = [
    {
        name: 'Peasant',
        aptitudes: uniformSkillMap(.5),
        criteria: (s: LifetimeStats) => { return 1.0; },
    },
    {
        name: 'Farmer',
        aptitudes: mostlyUniformSkillMap(.5, 
                        {
                            [SkillType.Farming]: 1.3,
                            [SkillType.Woodcutting]: .9
                        }),
        criteria: (s: LifetimeStats) => { return s.maxSkillLevel[SkillType.Farming] >= 10 },
    },
]

for (let j of klassData) {
    KLASSES.push(
        new Klass(j.name, j.aptitudes, j.criteria)
    );
}
