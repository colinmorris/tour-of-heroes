System.register(["@angular/core", "./notifications.service", "./simple-notifications.component", "./notification.component", "./max.pipe"], function(exports_1, context_1) {
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
    var core_1, notifications_service_1, simple_notifications_component_1, notification_component_1, max_pipe_1;
    var SimpleNotificationsModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (notifications_service_1_1) {
                notifications_service_1 = notifications_service_1_1;
            },
            function (simple_notifications_component_1_1) {
                simple_notifications_component_1 = simple_notifications_component_1_1;
            },
            function (notification_component_1_1) {
                notification_component_1 = notification_component_1_1;
            },
            function (max_pipe_1_1) {
                max_pipe_1 = max_pipe_1_1;
            }],
        execute: function() {
            SimpleNotificationsModule = (function () {
                function SimpleNotificationsModule() {
                }
                SimpleNotificationsModule = __decorate([
                    core_1.NgModule({
                        declarations: [simple_notifications_component_1.SimpleNotificationsComponent, notification_component_1.NotificationComponent, max_pipe_1.MaxPipe],
                        providers: [notifications_service_1.NotificationsService],
                        exports: [simple_notifications_component_1.SimpleNotificationsComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], SimpleNotificationsModule);
                return SimpleNotificationsModule;
            }());
            exports_1("SimpleNotificationsModule", SimpleNotificationsModule);
        }
    }
});
