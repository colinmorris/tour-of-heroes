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
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var angular2_notifications_1 = require('angular2-notifications');
var angular2_modal_1 = require('angular2-modal');
var index_1 = require('angular2-modal/plugins/bootstrap/index');
var app_component_1 = require('./shared/app.component');
var app_routes_1 = require('./shared/app.routes');
var spells_component_1 = require('./perks/spells.component');
var home_component_1 = require('./shared/home.component');
var klasses_component_1 = require('./klasses/klasses.component');
var stats_component_1 = require('./stats/stats.component');
var debug_component_1 = require('./shared/debug.component');
var about_component_1 = require('./shared/about.component');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, forms_1.FormsModule,
                angular2_notifications_1.SimpleNotificationsModule,
                angular2_modal_1.ModalModule.forRoot(), index_1.BootstrapModalModule,
                app_routes_1.routing
            ],
            declarations: [app_component_1.AppComponent,
                spells_component_1.SpellsComponent, home_component_1.HomeComponent, klasses_component_1.KlassesComponent, stats_component_1.StatsComponent,
                debug_component_1.DebugComponent, about_component_1.AboutComponent
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map