import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { TickerMessage, TickerMessagePriority } from './tickermessage';

@Injectable()
export class TickerService {
    // TODO: I think this is actually more complicated than it needed to be?
    subject = new Subject<TickerMessage>();

    tickerFeed = this.subject.asObservable();

    log(message: string) {
        let msg = new TickerMessage(message, TickerMessagePriority.Info);
        this.subject.next(msg);
    }

    logImportant(message: string) {
        let msg = new TickerMessage(message, TickerMessagePriority.Important);
        this.subject.next(msg);
    }

    logUnlock(message: string) {
        this.logImportant(message);
    }
}
