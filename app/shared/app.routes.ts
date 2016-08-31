import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { KlassesComponent } from '../klasses/klasses.component';
import { StatsComponent } from '../stats/stats.component';
import { DebugComponent } from './debug.component';
import { AboutComponent } from './about.component';

const routes : Routes = [
    {
        path: '',
        pathMatch: 'full',
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
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'debug',
        component: DebugComponent
    }

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
