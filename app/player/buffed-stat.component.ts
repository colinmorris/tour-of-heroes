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
        <span class="buffed"
            title="{{base | number:'1.1-2'}} + {{buffed-base | number:'1.1-2'}}">
            {{buffed | number:'1.0-1'}}
        </span>
    </template>
    `
})
export class BuffedStatComponent {
    @Input() base: number;
    @Input() buffed: number;
}
