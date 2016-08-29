import { ZoneAction } from './zoneaction.interface';
import { SkillMap, SkillMapOf, SkillType,
    uniformSkillMap, getTruthySkills
 } from '../skills/index';

export interface Zone {
    zid: number;
    superzone: string;
    actions: ZoneAction[];
    name: string;
    description: string;
    difficulty: number; // TODO: Not clear whether this really needs to be exposed?

    // Relating to zone leveling. Starts at 0 for all zones.
    level: number;

    // Return a per-skill 'difficulty score' for this zone, given a player's
    // skill levels. This score incorporates all potential actions in this zone.
    // A score of 0 means "N/A". Otherwise, scores currently reflect something like
    // expected inexperience penalty (1 = mastered).
    difficultyPerSkill(skillLevels: SkillMap) : ZoneDifficulty;
    chooseAction() : ZoneAction;
}

export interface SuperZone {
    name: string;
    zones: Zone[];
    unlockDescription: string;
    unlockCondition: (level: number) => boolean;
}

export interface SkillDifficulty {
    penalty: number;
    masteredAt: number;
}

export interface ZoneDifficulty {
    score: number;
    perSkill: SkillMapOf<SkillDifficulty>;
}

// TODO: move to separate file
export class ConcreteZone implements Zone {
    zid: number;
    superzone: string;
    actions: ZoneAction[];
    name: string;
    description: string;
    difficulty: number; // TODO: Not clear whether this really needs to be exposed?
    level: number = 0;
    difficultyPerSkill(skillLevels: SkillMap) : ZoneDifficulty {
        let skillWeights = uniformSkillMap(0);
        let totalSkillWeight = 0;
        for (let action of this.actions) {
            for (let skill of getTruthySkills(action.skillDeltas)) {
                skillWeights[skill] += action.weight;
                totalSkillWeight += action.weight;
            }
        }
        let difficulties = uniformSkillMap(0);
        let masteryLevels = uniformSkillMap(0);
        let overallExpectedPenalty = 0;
        for (let action of this.actions) {
            let actionPenalty = action.inexperiencePenalty(skillLevels);
            overallExpectedPenalty += action.weight * actionPenalty;
            for (let skill of getTruthySkills(action.skillDeltas)) {
                // How frequent is this action, relative to all actions involving this skill
                let relativeWeight = action.weight / skillWeights[skill];
                difficulties[skill] += relativeWeight *
                    action.inexperiencePenaltyForSkillLevel(skill, skillLevels[skill]);
                masteryLevels[skill] = Math.max(masteryLevels[skill], action.mastery);
            }
        }
        let diffObjs = new Array<SkillDifficulty>();
        for (let s=0; s < SkillType.MAX; s++) {
            if (difficulties[s] == 0) {
                diffObjs.push(undefined);
            } else {
                let diff:SkillDifficulty = {penalty: difficulties[s],
                    masteredAt: masteryLevels[s]};
                diffObjs.push(diff);
            }
        }
        return {score: overallExpectedPenalty, perSkill: diffObjs};
    }

    chooseAction() {
        let dice: number = Math.random();
        let sofar = 0;
        for (let action of this.actions) {
            sofar += action.weight;
            if (sofar > dice) {
                return action;
            }
        }
        console.assert(false, "Shouldnt have reached here.");
    }
}
