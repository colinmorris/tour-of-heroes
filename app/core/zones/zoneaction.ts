import { Verb } from './verb';
import { SkillType, SkillMap, getTruthySkills } from '../skills/index';
import { ZoneAction, ZoneActionDescription, ActionDelay } from './zoneaction.interface';
import { randomChoice } from '../utils';
import { GLOBALS } from '../../globals';

const ACTION_METAVAR: string = "__X";

export class VerbalZoneAction implements ZoneAction {
    constructor(
        private vb: Verb,
        private obj: string,
        private opts: string[],
        public skillDeltas: SkillMap,
        public weight: number,
        public minDelay: number,
        public mastery: number
    ) {

    }

    delay(skills: SkillMap) : ActionDelay {
        let inexp = this.inexperiencePenalty(skills);
        let delay = this.minDelay * inexp;
        console.log(`Base delay: ${this.minDelay}; After skill penalty: ${delay}`);
        return {base: this.minDelay, inexperiencePenalty: inexp};
    }

    // TODO: zzz this sucks
    inexperiencePenaltyForSkillLevel(skill: SkillType, skillLevel: number) {
        let shortfall = Math.max(0, this.mastery - skillLevel);
        return Math.pow(GLOBALS.inexperiencePenaltyBase, shortfall);
    }

    inexperiencePenalty(skills: SkillMap) : number {
        let inexperiencePenalty = 1.0;
        for (let s of getTruthySkills(this.skillDeltas)) {
            //inexperiencePenalty *= VerbalZoneAction.inexperiencePenaltyForSkill(skills[s], this.mastery);
            let shortfall = Math.max(0, this.mastery - skills[s]);
            inexperiencePenalty *= Math.pow(GLOBALS.inexperiencePenaltyBase, shortfall);
        }
        return inexperiencePenalty;
    }

    chooseDescription() : ZoneActionDescription {
        let predicate: string = this.descriptionPredicate();
        return {
            present: this.vb.pres + ' ' + predicate,
            past: this.vb.past + ' ' + predicate
        }
    }

    private descriptionPredicate() : string {
        let pred: string = this.obj;
        if (pred.indexOf(ACTION_METAVAR) != -1) {
            let sub = randomChoice(this.opts);
            pred = pred.replace(ACTION_METAVAR, sub);
        }
        return pred;
    }

}
