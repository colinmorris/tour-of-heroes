import { TickerService } from './ticker.service';
import { GameService } from './game.service';
import { GLOBALS } from './globals';
import { getTruthySkills, truthySkills, SkillType, SkillMap } from './skill';
import { Character } from './character';

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
    // Item drops...
}

export class ZoneActionModel {
    constructor(
        public vb: string,
        public obj: string,
        public opts: string[],
        /** skillDeltas = how many (base) skill points will I gain in each skill upon
         * completing this action? This also determines the difficulty of this action
         * (the higher the SP gain, the higher the player's skill levels need to be to
         * perform this action without a penalty to action speed)
         */
        public skillDeltas: SkillMap,
        public weight: number,
        public minDelay: number
    ) {}

    getEffect(game: GameService) : Outcome {
        return {skillDelta: this.skillDeltas};
    }
    
    // Not idempotent because of randomness
    chooseDescription() : ZoneActionDescription {
        let predicate: string = this.descriptionPredicate();
        return {
            present: this.vb  + "ing " + predicate,
            past: this.vb + "ed " + predicate
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
        // If player.skills[s] >= (this.skillDeltas[s]-1) for all s, we apply no
        // 'inexperience' penalty. Any skills below that threshold are punished (super-linearly)
        // (why -1? deltas start at 1, but skill levels start at 0)
        
        let inexperiencePenalty:number = 1.0;
        for (let s of getTruthySkills(this.skillDeltas)) {
            // TODO: it's possible these should be weighted for cases where skillDeltas.length > 1
            let shortfall = Math.max(0, this.skillDeltas[s] - (game.chara.skills[s].level+1));
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
