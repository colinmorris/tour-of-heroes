import { Buff } from './perk.interface';

export interface IPerkService {
    addBuff(buffName: string, ...buffArgs: any[]);
    addBuffObject(buff: Buff);
}
