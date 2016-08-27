/** An ongoing zone action. This is the representation that will be made
 available to the view. **/
export interface LiveZoneAction {
    description: string;
    pctProgress: number;

    remainingTime: number;
    duration: number;
    // Is this action actually ongoing? Or has it completed?
    active: boolean;
    // Where is this action taking place?
    zid: number;
    slowdown: number;
    spMultiplier: number;
    completeEarly();
    // Advance the progress of this action by the given amount of time.
    advanceProgress(skipMillis: number);
}
