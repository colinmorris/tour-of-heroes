import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'stats',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <h1>stats go here!</h1>
        <ul>
            <li *ngFor="let timer of timers | async">
                <b>{{timer | async}}</b>
            </li>
        </ul>
    `
})
export class StatsComponent {

    tick = 5000
    tock = 1000
    timers = Observable.interval(this.tick).scan( (acc:any[], next:number) => {
        let timer = Observable.interval(this.tock).take(10);
        return acc.concat([timer]);
    }, []);

    // timers = Observable.interval(this.tock).map( (i) => {
    //     return ["hello", i];
    // });
    //timers = Observable.interval(this.tock);
}
