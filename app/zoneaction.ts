import { Player } from './player';
import { TickerService } from './ticker.service';
import { GLOBALS } from './globals';
import { getTruthySkills, truthySkills, SkillType, SkillMap } from './skill';

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


class ZoneActionEffect {
    constructor(
        public skillDeltas: SkillMap
    ){}
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

    getEffect(player: Player) : ZoneActionEffect {
        return new ZoneActionEffect(this.skillDeltas);
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

    delay(player: Player) : number {
        // If player.skills[s] >= (this.skillDeltas[s]-1) for all s, we apply no
        // 'inexperience' penalty. Any skills below that threshold are punished (super-linearly)
        // (why -1? deltas start at 1, but skill levels start at 0)
        
        let inexperiencePenalty:number = 1.0;
        for (let s of getTruthySkills(this.skillDeltas)) {
            // TODO: it's possible these should be weighted for cases where skillDeltas.length > 1
            let shortfall = Math.max(0, this.skillDeltas[s] - (player.skills[s].level+1));
            inexperiencePenalty *= Math.pow(GLOBALS.inexperiencePenaltyBase, shortfall);
        }
        if (inexperiencePenalty > 1) {
            console.log("Penalizing by " + inexperiencePenalty);
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
    delta: SkillMap;
    constructor(
        public action: ZoneActionModel,
        public player: Player
    ){
        this.description = action.chooseDescription();
    }

    start(onCompletion: ()=>void) {
        this.duration = this.action.delay(this.player);
        this.startTime = new Date().getTime();
        this.timer = window.setTimeout(
            () => {
                this.effect();
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

    effect() {
        let ef: ZoneActionEffect = this.action.getEffect(this.player);
        this.delta = ef.skillDeltas;
        truthySkills(ef.skillDeltas, 
            (skill: SkillType, delta: number) => {
                this.player.trainSkill(skill, delta);
            }
        );
    }

    broadcast(ticker: TickerService) {
        // TODO
    }

}
