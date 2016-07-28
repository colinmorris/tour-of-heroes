import { Component, Input } from '@angular/core';

@Component({
    selector: 'progress-bar',
    template: `
    <div class="progress">
        <div class="progress-bar" [style.width.%]="percentProgress()"></div>
        {{numerator}} / {{denominator}}
    </div>
    `
})

export class ProgressBarComponent {

    @Input() numerator : number;
    @Input() denominator : number;

    percentProgress() : number {
        return 100 * (this.numerator/this.denominator);
    }
}
