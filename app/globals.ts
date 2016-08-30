export const GLOBALS = {
    playerLevelIncrement:  1,
    skillLevelBaseCost: 10,
    /** Going from skill level n to n+1 takes (this^n * skillLevelBaseCost)
    skill points.
    10 for level 1, doubling every 5 levels.
    i.e. 2^(1/5) = 1.1487
    let's try something more extreme, and double every 2 levels,
    2^(1/2) = 1.41421
    **/
    skillLevelExpPointCostBase: 1.1487,

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
    defaultBaseZoneDelay: 2500,

    // Disabling this for now. Stuff is changing too fast and the serialization
    // code is therefore pretty prone to breaking out of version compat issues
    loadSaves: true,

    autoSave: true,
    autoSaveIntervalMs: 60*1000,

    actionBarUpdateInterval: 300,
    actionBarTransitionMs: 600,

    // Every 3 levels of difference leads to a doubling of time.
    // TODO: Maybe this needs to grow faster than SP/skill level, otherwise
    // it will never make sense to "Warm up" for a high level zone in a lower
    // level one. Also helps 'bonus level' difficulty bump feel more impactful
    // Actually, the above may not be true. Definitely need to think about this
    // some more. Seems important that there exists some non-zero slowdown value
    // below which a zone starts becoming more efficient than a lower-level fullspeed zone.
    inexperiencePenaltyBase: 1.2599,

    inventoryCapacity: 5,

    dropRate: .1,

    // Useful for testing. Can reinc into any class regardless of unlock status.
    cheatMode: true,

    // This should probably be tagged on to save blobs
    version: "0.0.1"
}
