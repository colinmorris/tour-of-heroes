import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { KlassesComponent } from '../klasses/klasses.component';
import { StatsComponent } from '../stats/stats.component';
import { DebugComponent } from './debug.component';

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
    },
    {
        path: 'debug',
        component: DebugComponent
    }

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
