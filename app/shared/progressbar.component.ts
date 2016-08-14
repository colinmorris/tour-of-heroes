import { Component, Input } from '@angular/core';
import { Progress, Progressive } from './progressive.interface';

@Component({
    selector: 'progress-bar',
    template: `
    <div class="progress">
        <div class="progress-bar" [style.width.%]="percentProgress()"></div>
        {{prog.progress().numerator}} / {{prog.progress().denominator}}
    </div>
    `
})

export class ProgressBarComponent {

    @Input() prog: Progressive;

    percentProgress() : number {
        let currProg = this.prog.progress();
        return 100 * (currProg.numerator/currProg.denominator);
    }
}
