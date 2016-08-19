import { ZoneAction } from './zoneaction.interface';
import { SkillMap, uniformSkillMap, getTruthySkills } from '../skills/index';

export interface Zone {
    zid: number;
    superzone: string;
    actions: ZoneAction[];
    name: string;
    description: string;
    difficulty: number; // TODO: Not clear whether this really needs to be exposed?

    // Return a per-skill 'difficulty score' for this zone, given a player's 
    // skill levels. This score incorporates all potential actions in this zone.
    // A score of 0 means "N/A". Otherwise, scores currently reflect something like
    // expected inexperience penalty (1 = mastered).
    difficultyPerSkill(skillLevels: SkillMap) : SkillMap;
    // TODO: Move ChooseAction here
}

export class ConcreteZone implements Zone {
    zid: number;
    superzone: string;
    actions: ZoneAction[];
    name: string;
    description: string;
    difficulty: number; // TODO: Not clear whether this really needs to be exposed?

    difficultyPerSkill(skillLevels: SkillMap) : SkillMap {
        let skillWeights = uniformSkillMap(0);
        for (let action of this.actions) {
            for (let skill of getTruthySkills(action.skillDeltas)) {
                skillWeights[skill] += action.weight;
            }
        }
        let difficulties = uniformSkillMap(0);
        for (let action of this.actions) {
            for (let skill of getTruthySkills(action.skillDeltas)) {
                let relativeWeight = action.weight / skillWeights[skill];
                difficulties[skill] += relativeWeight *
                    action.inexperiencePenaltyForSkillLevel(skill, skillLevels[skill]);
            }
        }
        return difficulties;
    }

}
