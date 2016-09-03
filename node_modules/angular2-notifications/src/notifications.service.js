System.register(["@angular/core", 'rxjs/Rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, Rx_1;
    var NotificationsService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            }],
        execute: function() {
            NotificationsService = (function () {
                function NotificationsService() {
                    this._emitter = new Rx_1.Subject();
                }
                NotificationsService.prototype.set = function (notification, to) {
                    notification.id = notification.override && notification.override.id ? notification.override.id : Math.random().toString(36).substring(3);
                    this._emitter.next({ command: "set", notification: notification, add: to });
                    return notification;
                };
                ;
                NotificationsService.prototype.getChangeEmitter = function () { return this._emitter; };
                NotificationsService.prototype.success = function (title, content, override) { return this.set({ title: title, content: content, type: "success", override: override }, true); };
                NotificationsService.prototype.error = function (title, content, override) { return this.set({ title: title, content: content, type: "error", override: override }, true); };
                NotificationsService.prototype.alert = function (title, content, override) { return this.set({ title: title, content: content, type: "alert", override: override }, true); };
                NotificationsService.prototype.info = function (title, content, override) { return this.set({ title: title, content: content, type: "info", override: override }, true); };
                NotificationsService.prototype.bare = function (title, content, override) { return this.set({ title: title, content: content, type: "bare", override: override }, true); };
                NotificationsService.prototype.create = function (title, content, type, override) { return this.set({ title: title, content: content, type: type, override: override }, true); };
                NotificationsService.prototype.html = function (html, type, override) { return this.set({ html: html, type: type, override: override, title: null, content: null }, true); };
                NotificationsService.prototype.remove = function (id) {
                    if (id)
                        this._emitter.next({ command: "clean", id: id });
                    else
                        this._emitter.next({ command: "cleanAll" });
                };
                NotificationsService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], NotificationsService);
                return NotificationsService;
            }());
            exports_1("NotificationsService", NotificationsService);
        }
    }
});
