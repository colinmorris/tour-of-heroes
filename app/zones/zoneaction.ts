import { GLOBALS } from '../globals';
import { JSONtoSkillMap, getTruthySkills, truthySkills, SkillType, SkillMap } from '../skills/skills.data';
import { Player } from '../player/player';
//import { Item } from '../items/item';
import { Verb } from './verb';

const ACTION_METAVAR: string = "__X";

function randomChoice<T>(arr:Array<T>) : T {
    console.assert(arr.length > 0);
    let index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

interface ZoneActionDescription {
    present: string;
    past: string;
}

/**
export interface ActionOutcomeEvent {
    description: string;
    skillPoints?: SkillMap;
    item?: Item;
}

export interface ActionOutcome {
    main: ActionOutcomeEvent;
    secondary: ActionOutcomeEvent[];
}
**/

export class ZoneActionModel {
    constructor(
        public vb: Verb,
        public obj: string,
        public opts: string[],
        /** skillDeltas = how many (base) skill points will I gain in each skill upon
         * completing this action? */
        public skillDeltas: SkillMap,
        public weight: number,
        public minDelay: number,
        // Your skill levels must be at least this high to avoid an 'inexperience penalty'
        public mastery: number
    ) {}

    // Not idempotent because of randomness
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

    delay(chara: Player) : number {
        // If player.skills[s] >= this.mastery for all s, we apply no
        // 'inexperience' penalty. Any skills below that threshold are punished (super-linearly)

        let inexperiencePenalty:number = 1.0;
        for (let s of getTruthySkills(this.skillDeltas)) {
            // TODO: it's possible these should be weighted for cases where skillDeltas.length > 1
            let shortfall = Math.max(0, this.mastery - chara.skills[s].level);
            inexperiencePenalty *= Math.pow(GLOBALS.inexperiencePenaltyBase, shortfall);
        }
        if (inexperiencePenalty > 1) {
            //console.log("Penalizing by " + inexperiencePenalty);
        }
        return this.minDelay * inexperiencePenalty;
    }

}

/*
interface ZoneAction {
    description: ZoneActionDescription;
    pctProgress: number = 0;
    kill();
    start(onCompletion: ()=>void);
} */

export class ZoneAction {
    private timer: number;
    private startTime: number;
    private checkTimer: number;

    pctProgress: number = 0;
    description: ZoneActionDescription;
    constructor(
        public action: ZoneActionModel,
        public duration: number,
        // TODO XXX FIXME this is so dumb
        public zone: any
    ){
        this.description = action.chooseDescription();
    }

    // Set this action into, um, action. Starts a timer and puts the action's
    // effect into, er, effect after it's done (i.e. raising the player's skill
    // levels and so on). Also calls the given callback when the timer runs out.
    start(onCompletion: ()=>void) {
        this.startTime = new Date().getTime();
        this.timer = window.setTimeout(
            () => {
                onCompletion();
            },
            this.duration
        );
        this.checkTimer = window.setInterval(
            () => {
                this.pctProgress = this.percentProgress();
            },
            GLOBALS.actionBarUpdateInterval
        );
    }

    kill() {
        window.clearTimeout(this.timer);
        window.clearInterval(this.checkTimer);
    }

    private percentProgress() : number {
        let now = new Date().getTime();
        return 100 * (now - this.startTime)/this.duration;
    }

}
