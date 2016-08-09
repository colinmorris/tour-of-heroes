import { bootstrap }    from '@angular/platform-browser-dynamic';

import { AppComponent } from './shared/index';
import { appRouterProviders } from './shared/app.routes';

bootstrap(AppComponent, [
    appRouterProviders
]);

