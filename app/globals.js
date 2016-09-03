"use strict";
exports.GLOBALS = {
    playerLevelIncrement: 1,
    skillLevelBaseCost: 10,
    /** What's a reasonable number of actions to expect the player to take to
    raise a skill level? This reflects an optimistic scenario because:
    1) It assumes we're training in a zone whose mastery level exactly matches
        our current skill level.
    2) More significantly, our XP formulas will exponentially increase the
        ratio between SP gained per action and SP required per sLevel as sLevel
        increases. (Both increase exponentially, but the latter has a bigger base)
        So - until HA and other perks come in - this number will only be close
        to reality at level 1, and the actual actions/slvl figure will increase
        from there.
    **/
    benchmarkActionsPerSkillLevel: 3,
    /** Going from skill level n to n+1 takes (this^n * skillLevelBaseCost)
    skill points.
    10 for level 1, doubling every 5 levels.
    i.e. 2^(1/5) = 1.1487
    let's try something more extreme, and double every 2 levels,
    2^(1/2) = 1.41421
    2^(1/3) = 1.2599
    **/
    skillLevelExpPointCostBase: 1.2599,
    // Every 3 levels of difference leads to a doubling of time.
    // TODO: Maybe this needs to grow faster than SP/skill level, otherwise
    // it will never make sense to "Warm up" for a high level zone in a lower
    // level one. Also helps 'bonus level' difficulty bump feel more impactful
    // Actually, the above may not be true. Definitely need to think about this
    // some more. Seems important that there exists some non-zero slowdown value
    // below which a zone starts becoming more efficient than a lower-level fullspeed zone.
    inexperiencePenaltyBase: 1.41421,
    /** When checking for slowdown, this proportion of player level will be added
    to the relevant skill levels, and that sum will be compared to the action
    mastery. Rationale: makes charting a path through zones more strategic
    (e.g. I want to train at the Tournament, but my riding skill isn't high
    enough. Previously: either gotta train riding in the Stables, or take the
    Tournament slowdown hit. With "level assist": I can decide I don't want
    to pre-game in the Stables because my farming apt sucks, or the gains aren't
    high enough, and decide instead to go train other skills for a while until
    the Tournament turns green).

    TODO: 1/5 might be a bit too high. Basically want this to be high enough
    that it makes it worthwhile to plan around, defering zones to later. But not
    so high that it makes adventuring in zones tuned slightly above the player level
    prohibitive. High values may over-encourage generalization (given that it's
    already sort of encouraged by the way XP formulas scale)
    **/
    levelAssistFraction: .15,
    reincarnationMinLevel: 10,
    zoneLevelingMinLevel: 25,
    difficultyBonusPerZoneLevel: 20,
    /** One of 'exp' or 'lin'.
    Determines whether ancestry bonus grows linearly or exponentially. **/
    ancestryBonusGrowthRate: 'exp',
    // TODO: Probably need compatibility versions at some point. Bleh.
    localStorageToken: 'joat',
    backgroundSaveFrequency_ms: 1000 * 60,
    // The default minimum delay of actions across zones in ms
    defaultBaseZoneDelay: 4000,
    // Disabling this for now. Stuff is changing too fast and the serialization
    // code is therefore pretty prone to breaking out of version compat issues
    loadSaves: true,
    autoSave: true,
    autoSaveIntervalMs: 60 * 1000,
    // TODO: make sure this isn't ridiculous from a perf POV
    actionBarUpdateInterval: 100,
    actionBarTransitionMs: 600,
    /** Check unlocks this often. TODO: this is kind of wasteful. With better
    use of observables, it wouldn't be necessary to poll like this. **/
    unlockCheckInterval: 5000,
    inventoryCapacity: 5,
    dropRate: .1,
    // Useful for testing. Can reinc into any class regardless of unlock status.
    cheatMode: false,
    // This should probably be tagged on to save blobs
    version: "0.0.1"
};
//# sourceMappingURL=globals.js.map