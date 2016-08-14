import { Injector, OpaqueToken } from '@angular/core';

// TODO: rename me

export class InjectedArgs {
    protected diTokens: OpaqueToken[];
    constructor(
        protected injector: Injector
    ) {
    }

    protected injectionArgs() : any[] {
        let args = [];
        for (let token of this.diTokens) {
            let service = this.injector.get(token);
            args.push(service);
        }
        return args;
    }
}
