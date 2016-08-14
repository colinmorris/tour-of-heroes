import { Injector, OpaqueToken } from '@angular/core';

export interface Castable {

    cast(injector: Injector);

}

export abstract class AbstractCastable<T> {
    protected diTokens: OpaqueToken[];

    // TODO: bleh lazy
    wrapcast(injector: Injector) : T {
        return this.injectiveCast(injector);
    }

    protected injectionArgs(injector: Injector) : any[] {
        let args = [];
        for (let token of this.diTokens) {
            let service = injector.get(token);
            args.push(service);
        }
        return args;
    }

    injectiveCast(injector: Injector) : T {
        return this.onCast(...this.injectionArgs(injector));
    }

    protected abstract onCast(...services: any[]);
}
