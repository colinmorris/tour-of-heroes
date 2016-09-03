"use strict";
var router_1 = require('@angular/router');
var home_component_1 = require('./home.component');
var klasses_component_1 = require('../klasses/klasses.component');
var stats_component_1 = require('../stats/stats.component');
var debug_component_1 = require('./debug.component');
var about_component_1 = require('./about.component');
var routes = [
    {
        path: '',
        pathMatch: 'full',
        component: home_component_1.HomeComponent
    },
    {
        path: 'classes',
        component: klasses_component_1.KlassesComponent
    },
    {
        path: 'stats',
        component: stats_component_1.StatsComponent
    },
    {
        path: 'about',
        component: about_component_1.AboutComponent
    },
    {
        path: 'debug',
        component: debug_component_1.DebugComponent
    }
];
exports.routing = router_1.RouterModule.forRoot(routes);
//# sourceMappingURL=app.routes.js.map