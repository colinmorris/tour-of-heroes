import { TickerService } from './ticker.service';
import { GameService } from './game.service';
import { GLOBALS } from './globals';
import { JSONtoSkillMap, getTruthySkills, truthySkills, SkillType, SkillMap } from './skill.data';
import { Character } from './character';
import { Item } from './item';
import { Verb } from './verb';

const ACTION_METAVAR: string = "__X";

function randomChoice<T>(arr:Array<T>) : T {
    console.assert(arr.length > 0);
    let index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

class ZoneActionDescription {
    present: string;
    past: string;
}

export interface Outcome {
    skillDelta: SkillMap;
    item?: Item;
}

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

    getEffect(game: GameService) : Outcome {
        return {skillDelta: this.skillDeltas};
    }
    
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

    delay(game: GameService) : number {
        // If player.skills[s] >= this.mastery for all s, we apply no
        // 'inexperience' penalty. Any skills below that threshold are punished (super-linearly)
        
        let inexperiencePenalty:number = 1.0;
        for (let s of getTruthySkills(this.skillDeltas)) {
            // TODO: it's possible these should be weighted for cases where skillDeltas.length > 1
            let shortfall = Math.max(0, this.mastery - game.chara.skills[s].level);
            inexperiencePenalty *= Math.pow(GLOBALS.inexperiencePenaltyBase, shortfall);
        }
        if (inexperiencePenalty > 1) {
            //console.log("Penalizing by " + inexperiencePenalty);
        }
        return this.minDelay * inexperiencePenalty;
    }
        
}


export class ZoneAction {
    timer: number;
    startTime: number;
    duration: number;
    completed: boolean = false;

    checkTimer: number;
    pctProgress: number = 0;
    description: ZoneActionDescription;
    outcome: Outcome;
    constructor(
        public action: ZoneActionModel,
        public game: GameService
    ){
        this.description = action.chooseDescription();
    }

    // Set this action into, um, action. Starts a timer and puts the action's
    // effect into, er, effect after it's done (i.e. raising the player's skill
    // levels and so on). Also calls the given callback when the timer runs out.
    start(onCompletion: ()=>void) {
        this.duration = this.action.delay(this.game);
        this.startTime = new Date().getTime();
        this.timer = window.setTimeout(
            () => {
                this.outcome = this.action.getEffect(this.game);
                this.completed = true;
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

    percentProgress() : number {
        let now = new Date().getTime();
        return 100 * (now - this.startTime)/this.duration;
    }

    broadcast(ticker: TickerService) {
        // TODO
    }

}
