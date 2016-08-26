export const GLOBALS = {
    playerLevelIncrement:  1,
    skillLevelBaseCost: 10,
    /** Going from skill level n to n+1 takes (this^n * skillLevelBaseCost)
    skill points.
    10 for level 1, doubling every 5 levels.
    **/
    skillLevelExpPointCostBase: 1.1487,

    reincarnationMinLevel: 10,

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

    autoSave: false,
    autoSaveIntervalMs: 60*1000,

    actionBarUpdateInterval: 300,
    actionBarTransitionMs: 600,

    // Every 5 levels of difference leads to a doubling of time.
    inexperiencePenaltyBase: 1.1487,

    inventoryCapacity: 5,

    dropRate: .1,

    // Useful for testing. Can reinc into any class regardless of unlock status.
    cheatMode: true,

    // This should probably be tagged on to save blobs
    version: "0.0.1"
}
