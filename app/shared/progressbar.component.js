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
var ProgressBarComponent = (function () {
    function ProgressBarComponent() {
        this.hover = false;
    }
    ProgressBarComponent.prototype.percentProgress = function () {
        var currProg = this.prog.progress();
        if (currProg.denominator < currProg.numerator) {
            console.warn("Numerator greater than denominator. Um.");
        }
        return 100 * (currProg.numerator / currProg.denominator);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ProgressBarComponent.prototype, "prog", void 0);
    ProgressBarComponent = __decorate([
        core_1.Component({
            selector: 'progress-bar',
            styles: ["\n        .progress {\n            position: relative;\n        }\n        .hover-text {\n            position: absolute;\n            display: block;\n            width: 100%;\n            color: black;\n        }\n    "],
            template: "\n    <div on-mouseenter=\"hover=true\" on-mouseleave=\"hover=false\" class=\"progress\">\n        <div class=\"progress-bar progress-bar-info\" [style.width.%]=\"percentProgress()\">\n            <span class=\"hover-text\" *ngIf=\"hover\">\n                {{prog.progress().numerator | number:'1.0-0'}} /\n                {{prog.progress().denominator | number:'1.0-0'}}\n            </span>\n        </div>\n\n    </div>\n    "
        }), 
        __metadata('design:paramtypes', [])
    ], ProgressBarComponent);
    return ProgressBarComponent;
}());
exports.ProgressBarComponent = ProgressBarComponent;
//# sourceMappingURL=progressbar.component.js.map