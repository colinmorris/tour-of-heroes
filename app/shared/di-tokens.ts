import { OpaqueToken } from '@angular/core';

export namespace di_tokens {
        export const actionservice: OpaqueToken = new OpaqueToken('action_service');
        export const playerservice: OpaqueToken = new OpaqueToken('player_service');
        export const perkservice: OpaqueToken = new OpaqueToken('perk_service');
        export const statsservice: OpaqueToken = new OpaqueToken('stats_service');
}
