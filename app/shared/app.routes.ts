import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { KlassesComponent } from '../klasses/klasses.component';
import { StatsComponent } from '../stats/stats.component';

const routes : Routes = [
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
    
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
