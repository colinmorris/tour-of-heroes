import { provideRouter, RouterConfig } from '@angular/router';

import { HomeComponent } from './home.component';
import { KlassesComponent } from '../klasses/klasses.component';
import { StatsComponent } from '../stats/stats.component';

const routes : RouterConfig = [
    {
        // TODO: is superzone? optional by default?
        path: 'explore/:superzone',
        component: HomeComponent
    },
    {
        path: 'classes',
        component: KlassesComponent
    },
    {
        path: 'stats',
        component: StatsComponent
    },


    {
        path: '',
        redirectTo: '/explore/fields',
        pathMatch: 'full'
    },
    {
        path: 'explore',
        redirectTo: '/explore/fields',
        pathMatch: 'full'
    }
]

export const appRouterProviders = [
    provideRouter(routes)
];
