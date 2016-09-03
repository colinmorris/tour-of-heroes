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
var core_1 = require("@angular/core");
var PushNotificationsService = (function () {
    function PushNotificationsService() {
        this.canActivate = false;
    }
    PushNotificationsService.prototype.activate = function () {
        var _this = this;
        if (!("Notification" in window))
            return { success: false, message: "This browser does not support desktop notification." };
        if (Notification.permission === "granted")
            return { success: true, message: "Permission already granted." };
        else if (Notification.permission !== "denied") {
            Notification.requestPermission()
                .then(function (a) {
                if (a === "denied")
                    console.log("Permission wasn't granted");
                else if (a === "default")
                    console.log("The permission request was dismissed.");
                else
                    _this.createBuffered();
            });
        }
    };
    PushNotificationsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], PushNotificationsService);
    return PushNotificationsService;
}());
exports.PushNotificationsService = PushNotificationsService;
//# sourceMappingURL=push-notifications.service.js.map