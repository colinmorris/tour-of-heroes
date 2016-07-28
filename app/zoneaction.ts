import { Player } from './player';
import { TickerService } from './ticker.service';

export class ZoneAction {
    constructor(
        public vb: string,
        public obj: string,
        public opts: string[],
        public skills: Object,
        public weight: number,
        public minDelay: number
    ) {}
        
    delay(player: Player) : number {
        // TODO
        return this.minDelay;
    }

    effect(player: Player) {
        // TODO
    }

    broadcast(ticker: TickerService) {
        // TODO
    }
}
