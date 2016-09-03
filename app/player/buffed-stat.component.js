"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var BuffedStatComponent = (function () {
    function BuffedStatComponent() {
        this.toast = false;
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], BuffedStatComponent.prototype, "base", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], BuffedStatComponent.prototype, "buffed", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], BuffedStatComponent.prototype, "toast", void 0);
    BuffedStatComponent = __decorate([
        core_1.Component({
            selector: 'buffed-stat',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            styles: ["\n        .buffed {\n            color: green;\n        }\n        .toast {\n            position: absolute;\n            color: green;\n            opacity: 0;\n            z-index: 10;\n        }\n        .stat {\n            position: absolute;\n            z-index: 0;\n        }\n    "],
            /** TODO: Would be nice to make a reusable component out of this. Would
            definitely be good to have toasts for player level as well.
            **/
            animations: [
                core_1.trigger('baseValueToast', [
                    // Avoid spurious animations on component init
                    core_1.transition('void => *', []),
                    core_1.transition('* => *', [
                        core_1.animate('200ms ease-in', core_1.style({
                            opacity: 1.0,
                        })),
                        core_1.animate('800ms ease-out', core_1.style({
                            opacity: 0.0,
                            'top': -20,
                        })),
                    ])
                ]),
                core_1.trigger('baseValue', [
                    core_1.transition('void => *', []),
                    core_1.transition('* => *', [
                        core_1.style({
                            opacity: 0.0
                        }),
                        core_1.animate('800ms ease-in', core_1.style({
                            opacity: 1.0,
                        })),
                    ])
                ])
            ],
            template: "\n    <div>\n    <template [ngIf]=\"base == buffed\">\n        <span *ngIf=\"toast\" class=\"stat\" [@baseValue]=\"base\">{{base}}</span>\n        <span *ngIf=\"!toast\" class=\"stat\">{{base}}</span>\n    </template>\n    <template [ngIf]=\"base != buffed\">\n        <span class=\"stat buffed\"\n            title=\"{{base | number:'1.1-2'}} + {{buffed-base | number:'1.1-2'}}\">\n            <span *ngIf=\"toast\" [@baseValue]=\"base\">\n            {{buffed | number:'1.1-1'}}\n            </span>\n            <span *ngIf=\"!toast\">\n            {{buffed | number:'1.1-1'}}\n            </span>\n        </span>\n    </template>\n    <span *ngIf=\"toast\" class=\"toast\"\n        [@baseValueToast]=\"base\"\n        >+1</span>\n    </div>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], BuffedStatComponent);
    return BuffedStatComponent;
}());
exports.BuffedStatComponent = BuffedStatComponent;
//# sourceMappingURL=buffed-stat.component.js.map