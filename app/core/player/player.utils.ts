import { SkillMap,
    SkillMapOf,
    skillMapFromFactory,
    SkillType } from '../skills/index';
import { PlayerSkill } from './playerskill';

export function newbornPlayerSkills(aptitudes: SkillMap) : SkillMapOf<PlayerSkill> {
    return skillMapFromFactory<PlayerSkill>(playerSkillFactoryFactory(aptitudes));
}

function playerSkillFactoryFactory(aptitudes: SkillMap) : (number) => PlayerSkill {
    return (skillId: number) => {
        return {
            id: skillId,
            name: SkillType[skillId],
            level: 0,
            aptitude: aptitudes[skillId],
            skillPoints: 0
        }
    }
}
