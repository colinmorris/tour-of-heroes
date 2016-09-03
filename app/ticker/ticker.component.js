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
var ticker_service_1 = require('./ticker.service');
var TickerComponent = (function () {
    function TickerComponent(tickerService) {
        var _this = this;
        this.tickerService = tickerService;
        this.messages = [];
        tickerService.tickerFeed.subscribe(function (msg) {
            _this.messages.push(msg);
        });
    }
    TickerComponent = __decorate([
        core_1.Component({
            selector: 'ticker',
            styles: ["\n        .ticker {\n            max-height: 100px;\n            background: rgba(220, 220, 200, 1.0);\n        }\n        "],
            template: "\n    <div class=\"ticker\">\n        <div *ngFor=\"let message of messages\" [style.color]=\"message.priority == 5 ? 'green' : 'black'\">{{message.text}}</div>\n    </div>\n    ",
        }), 
        __metadata('design:paramtypes', [ticker_service_1.TickerService])
    ], TickerComponent);
    return TickerComponent;
}());
exports.TickerComponent = TickerComponent;
//# sourceMappingURL=ticker.component.js.map