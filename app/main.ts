import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

//import { platformBrowser } from '@angular/platform-browser';
//import { AppModuleNgFactory } from './app.module.ngfactory';
import { AppModule } from './app.module';

enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);
//platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);

