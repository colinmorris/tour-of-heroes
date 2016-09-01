import { Verb } from './verb';
import { SkillType, SkillMap, getTruthySkills,
    XpFormulas } from '../skills/index';
import { ZoneAction, ZoneActionDescription, ActionDelay } from './zoneaction.interface';
import { randomChoice } from '../utils';
import { GLOBALS } from '../../globals';
import { NamedUnlock } from '../stats/index';
import { OneShotAction } from './action-oneshots.enum';
import { Player } from '../../player/player.interface';

const ACTION_METAVAR: string = "__X";

export class VerbalZoneAction implements ZoneAction {
    constructor(
        private vb: Verb,
        private obj: string,
        private opts: string[],
        public skillDeltas: SkillMap,
        public weight: number,
        public minDelay: number,
        public mastery: number,
        public unlocks?: NamedUnlock,
        public oneshot?: OneShotAction
    ) {

    }

    inexperiencePenaltyForSkill(skill: SkillType, player: Player) {
        let levelAssist = XpFormulas.levelAssist(player.level);
        let shortfall = Math.max(0, this.mastery -
            (player.skills[skill].level + levelAssist)
        );
        return Math.pow(GLOBALS.inexperiencePenaltyBase, shortfall) - 1;
    }

    slowdown(player: Player) : number {
        let levelAssist = XpFormulas.levelAssist(player.level);
        let inexperiencePenalty = 1;
        for (let s of getTruthySkills(this.skillDeltas)) {
            let shortfall = Math.max(0, this.mastery -
                (player.skills[s].level + levelAssist)
            );
            inexperiencePenalty *= Math.pow(GLOBALS.inexperiencePenaltyBase, shortfall);
        }
        return inexperiencePenalty - 1;
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
