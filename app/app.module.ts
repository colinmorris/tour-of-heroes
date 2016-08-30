import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { SimpleNotificationsModule } from 'angular2-notifications';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap/index';

import { AppComponent } from './shared/app.component';
import { routing } from './shared/app.routes';

import { SpellsComponent } from './perks/spells.component';
import { HomeComponent } from './shared/home.component';
import { KlassesComponent } from './klasses/klasses.component';
import { StatsComponent } from './stats/stats.component';
import { DebugComponent } from './shared/debug.component';

@NgModule({
    imports: [BrowserModule, FormsModule,
        SimpleNotificationsModule,
        ModalModule.forRoot(), BootstrapModalModule,
        routing
    ],
    declarations: [AppComponent,
        SpellsComponent, HomeComponent, KlassesComponent, StatsComponent,
        DebugComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
