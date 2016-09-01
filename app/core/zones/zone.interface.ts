import { ZoneAction } from './zoneaction.interface';
import { SkillMap, SkillMapOf, SkillType,
    uniformSkillMap, getTruthySkills,
    XpFormulas
 } from '../skills/index';
 import { Player } from '../../player/player.interface';

export interface Zone {
    zid: number;
    superzone: string;
    actions: ZoneAction[];
    name: string;
    description: string;
    difficulty: number; // TODO: Not clear whether this really needs to be exposed?

    // Relating to zone leveling. Starts at 0 for all zones.
    level: number;

    // TODO: rename me/document me
    difficultyPerSkill(player: Player) : ZoneDifficulty;
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
    // Overall expected slowdown [0,inf)
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
    difficultyPerSkill(player: Player) : ZoneDifficulty {
        /** First figure out how significant each skill is, given the probability
        weights on each action.
        **/
        let skillWeights = uniformSkillMap(0);
        let totalSkillWeight = 0;
        for (let action of this.actions) {
            for (let skill of getTruthySkills(action.skillDeltas)) {
                skillWeights[skill] += action.weight;
                totalSkillWeight += action.weight;
            }
        }
        /** difficulties[s] := expected slowdown imposed by s, calculated over
                                all actions in this zone involving s
        **/
        let difficulties = uniformSkillMap(0);
        /** mastery[s] := s must be this level for this skill to impose no slowdown
                          for any action in this zone (fn of current plevel!)
        **/
        let masteryLevels = uniformSkillMap(0);
        let overallExpectedPenalty = 0;
        let levelAssist = XpFormulas.levelAssist(player.level);
        for (let action of this.actions) {
            let actionPenalty = action.slowdown(player);
            overallExpectedPenalty += action.weight * actionPenalty;
            for (let skill of getTruthySkills(action.skillDeltas)) {
                // How frequent is this action, relative to all actions involving this skill
                let relativeWeight = action.weight / skillWeights[skill];
                difficulties[skill] += relativeWeight *
                    action.inexperiencePenaltyForSkill(skill, player);
                /** Mastery is compared to skill level plus levelAssist. Let's
                isolate the skill level portion. **/
                let skillRequired = action.mastery - levelAssist;
                masteryLevels[skill] = Math.max(masteryLevels[skill], skillRequired);
            }
        }
        let diffObjs = new Array<SkillDifficulty>();
        for (let s=0; s < SkillType.MAX; s++) {
            if (skillWeights[s] == 0) {
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
