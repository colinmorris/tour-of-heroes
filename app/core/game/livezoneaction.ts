/** An ongoing zone action. This is the representation that will be made
 available to the view. **/
export interface LiveZoneAction {
    description: string;
    pctProgress: number;

    remainingTime: number;
    duration: number;
    /** TODO: attributes to be added later
    inexperiencePenalty: number;
    */
    completeEarly();
}
