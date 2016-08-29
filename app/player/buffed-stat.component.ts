import { Component, Input,
    ChangeDetectionStrategy,
    trigger, state, style, transition, animate
 } from '@angular/core';

@Component({
    selector: 'buffed-stat',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .buffed {
            color: green;
        }
        .toast {
            position: absolute;
            color: green;
            opacity: 0;
            z-index: 10;
        }
        .stat {
            position: absolute;
            z-index: 0;
        }
    `],
    /** TODO: Would be nice to make a reusable component out of this. Would
    definitely be good to have toasts for player level as well.
    **/
    animations: [
        /** TODO: It's kind of annoying that these animations fire when loading
        the page. Can maybe fix this by defining some void=>* transitions (Which
        will maybe take priority cause they have greater specificity?).
        **/
        trigger('baseValueToast', [
            transition('void => *',
            []),
            transition('* => *', [
                animate('200ms ease-in', style({
                    opacity: 1.0,
                })),
                animate('800ms ease-out', style({
                    opacity: 0.0,
                    'top': -20,
                })),
                // Originally had a rule to restore top (to '*'), but that seems
                // not to be necessary. Which is nice.
            ])
        ]),
        trigger('baseValue', [
            transition('void => *',
            []),
            transition('* => *', [
                style({
                    opacity: 0.0
                }),
                animate('800ms ease-in', style({
                    opacity: 1.0,
                })),
            ])
        ])
    ],
    template: `
    <div>
    <template [ngIf]="base == buffed">
        <span *ngIf="toast" class="stat" @baseValue="base">{{base}}</span>
        <span *ngIf="!toast" class="stat">{{base}}</span>
    </template>
    <template [ngIf]="base != buffed">
        <span class="stat buffed"
            title="{{base | number:'1.1-2'}} + {{buffed-base | number:'1.1-2'}}">
            <span *ngIf="toast" @baseValue="base">
            {{buffed | number:'1.1-1'}}
            </span>
            <span *ngIf="!toast">
            {{buffed | number:'1.1-1'}}
            </span>
        </span>
    </template>
    <span *ngIf="toast" class="toast"
        @baseValueToast="base"
        >+1</span>
    </div>
    `
})
export class BuffedStatComponent {
    @Input() base: number;
    @Input() buffed: number;
    @Input() toast: boolean = false;
}
