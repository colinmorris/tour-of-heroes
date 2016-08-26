import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SimpleNotificationsModule } from 'angular2-notifications';

import { AppComponent } from './shared/app.component';
import { routing } from './shared/app.routes';

@NgModule({
    imports: [BrowserModule, SimpleNotificationsModule,
        routing
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
