import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'buffed-stat',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .buffed {
            color: green;
        }
    `],
    template: `
    <template [ngIf]="base == buffed">
        {{base}}
    </template>
    <template [ngIf]="base != buffed">
        <span class="buffed" title="{{base}} + {{buffed-base}}">{{buffed}}</span>
    </template>
    `
})
export class BuffedStatComponent {
    @Input() base: number;
    @Input() buffed: number;
}
