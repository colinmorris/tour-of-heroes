import { Component, Input } from '@angular/core';
import { Progress, Progressive } from './progressive.interface';

@Component({
    selector: 'progress-bar',
    styles: [`
        .progress {
            position: relative;
        }
        .hover-text {
            position: absolute;
            display: block;
            width: 100%;
            color: black;
        }
    `],
    template: `
    <div on-mouseenter="hover=true" on-mouseleave="hover=false" class="progress">
        <div class="progress-bar progress-bar-info" [style.width.%]="percentProgress()">
            <span class="hover-text" *ngIf="hover">
                {{prog.progress().numerator | number:'1.0-0'}} /
                {{prog.progress().denominator | number:'1.0-0'}}
            </span>
        </div>

    </div>
    `
})

export class ProgressBarComponent {
    hover = false;
    @Input() prog: Progressive;

    percentProgress() : number {
        let currProg = this.prog.progress();
        if (currProg.denominator < currProg.numerator) {
            console.warn(`Numerator greater than denominator. Um.`);
        }
        return 100 * (currProg.numerator/currProg.denominator);
    }
}
