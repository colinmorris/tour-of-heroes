import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './shared/app.component';
import { routing } from './shared/app.routes';

@NgModule({
    imports: [BrowserModule, 
        routing
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
