import { Component, Input } from '@angular/core';
import { Progress, Progressive } from './progressive.interface';

@Component({
    selector: 'progress-bar',
    // TODO: this method of showing num/denominator is kind of janky (weird
    // things happen when it gets crowded out by the bar)
    template: `
    <div on-mouseenter="hover=true" on-mouseleave="hover=false" class="progress">
        <div class="progress-bar" [style.width.%]="percentProgress()"></div>
        <span *ngIf="hover">{{prog.progress().numerator}} / {{prog.progress().denominator}}
        </span>
    </div>
    `
})

export class ProgressBarComponent {
    hover = false;
    @Input() prog: Progressive;

    percentProgress() : number {
        let currProg = this.prog.progress();
        return 100 * (currProg.numerator/currProg.denominator);
    }
}
