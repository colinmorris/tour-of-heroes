import { Verb } from './verb';
import { SkillMap } from '../skills/index';
import { ZoneAction, ZoneActionDescription } from './zoneaction.interface';
import { randomChoice } from '../utils';

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
