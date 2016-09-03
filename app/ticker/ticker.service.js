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
var Subject_1 = require('rxjs/Subject');
var tickermessage_1 = require('./tickermessage');
var TickerService = (function () {
    function TickerService() {
        // TODO: I think this is actually more complicated than it needed to be?
        this.subject = new Subject_1.Subject();
        this.tickerFeed = this.subject.asObservable();
    }
    TickerService.prototype.log = function (message) {
        var msg = new tickermessage_1.TickerMessage(message, tickermessage_1.TickerMessagePriority.Info);
        this.subject.next(msg);
    };
    TickerService.prototype.logImportant = function (message) {
        var msg = new tickermessage_1.TickerMessage(message, tickermessage_1.TickerMessagePriority.Important);
        this.subject.next(msg);
    };
    TickerService.prototype.logUnlock = function (message) {
        this.logImportant(message);
    };
    TickerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], TickerService);
    return TickerService;
}());
exports.TickerService = TickerService;
//# sourceMappingURL=ticker.service.js.map