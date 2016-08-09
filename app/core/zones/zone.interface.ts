import { ZoneAction } from './zoneaction.interface';

export interface Zone {
    zid: number;
    superzone: string;
    actions: ZoneAction[];
    name: string;
    description: string;
    difficulty: number;
}
