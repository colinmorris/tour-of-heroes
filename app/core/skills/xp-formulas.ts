import { GLOBALS } from '../../globals';

export namespace XpFormulas {

    /** How many SP must be gained to advance from the given skill level to
    that level+1? **/
    export function skillPointsToAdvanceLevel(skillLevelFrom: number) : number {
        let raw = Math.floor(GLOBALS.skillLevelBaseCost *
            Math.pow(GLOBALS.skillLevelExpPointCostBase, skillLevelFrom));
        let remainder = raw % 5;
        return raw - remainder;
    }

    /** About how many SP should a 'standard' action of appropriate difficulty
    give for the given player level?
    **/
    export function standardSpServing(plevel: number) : number {
        /** Okay, so clearly this should scale with level and shouldn't just
        be a static constant.

        And clearly it should not grow as fast as SP/level grows, otherwise
        progression will just increase linearly without bound.

        So somewhere between those two functions there's got to be a sweet spot.

        Here's one idea:
        let S = GLOBALS.skillLevelExpPointCostBase;
        var G;
        let k be a reasonable benchmark skill level for our player level (say,
            the skill level of all our skills if we distributed all SP evenly to
            reach this level.)
        we know that reaching skill level k requires SkillUp(k) ~= 10*S^k skill points
        let standardSpServing = 10*G^k;

        I did the monster math, and this would give
            standardSpServing = SkillUp(k) * exp(k * log(G/S))

        So obviously setting G=S will just lead to Serving=SkillUp(k)
        But if we set G to S/e, we get
            Serving = SkillUp(k) / exp(k)
        That probably works, right? It seems harsh, but if the ancestry bonus
        is exponential, it could sort of balance it out, allowing the player to
        climb to higher difficulties as they gain more reincarnations and unlocks.

        (If we wanted to go with a milder rate of growth, we could do something like
            Serving(k) = SkillUp(k)/x
            where x=k, or x=k^2, or something.
        )
        **/
        let k = benchmarkSkillLevelForPlevel(plevel);
        return standardSpServingForSkillLevel(k);

    }

    /** If skill X is level Y, what's a 'reasonable' number of skill points to
    give to X (e.g. for an action that trains X and has a mastery level around Y).
    **/
    export function standardSpServingForSkillLevel(level: number) {
        /** A couple nitty gritty details not specified above:
        - G = S/e probably is too harsh. Let's start with S/1.1
        - we probably want to peg this to, say, SkillUp(k)/5. So in the
          limiting case of small K, or equal G and S, we're looking at ~25
          actions to gain a level (rather than 1)
        **/
        let G = GLOBALS.skillLevelExpPointCostBase / 1.1;
        return Math.pow(G, level) * GLOBALS.skillLevelBaseCost
                / GLOBALS.benchmarkActionsPerSkillLevel;
    }

    export function benchmarkSkillLevelForPlevel(plevel: number) {
        /** 5 skill lvls per plevel. Let's assume a perfectly virtuous player
        who distributes SP evenly across all skills.
        **/
        // Let's say a *mostly* virtuous player
        return (plevel*5)/8.0; // I sure hope the set of skills never changes...
    }
}
