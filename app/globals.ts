// XXX
import { OpaqueToken } from '@angular/core';
export const actionToken: OpaqueToken = new OpaqueToken('ACTION');


export const GLOBALS = {
    playerLevelIncrement:  5,
    skillLevelBaseCost: 10,

    // TODO: Probably need compatibility versions at some point. Bleh.
    localStorageToken: 'joat',
    backgroundSaveFrequency_ms: 1000 * 60,

    // The default minimum delay of actions across zones in ms
    defaultBaseZoneDelay: 2500,

    // Disabling this for now. Stuff is changing too fast and the serialization
    // code is therefore pretty prone to breaking out of version compat issues
    loadSaves: false,

    actionBarUpdateInterval: 50,

    // Every 5 levels of difference leads to a doubling of time.
    inexperiencePenaltyBase: 1.1487,

    inventoryCapacity: 5,

    dropRate: .1
}
