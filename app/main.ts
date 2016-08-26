import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

//import { platformBrowser } from '@angular/platform-browser';
//import { AppModuleNgFactory } from './app.module.ngfactory';
import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
//platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);

