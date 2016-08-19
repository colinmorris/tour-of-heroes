import { provideRouter, RouterConfig } from '@angular/router';

import { HomeComponent } from './home.component';
import { KlassesComponent } from '../klasses/klasses.component';
import { StatsComponent } from '../stats/stats.component';

const routes : RouterConfig = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'classes',
        component: KlassesComponent
    },
    {
        path: 'stats',
        component: StatsComponent
    }
    
]

export const appRouterProviders = [
    provideRouter(routes)
];
