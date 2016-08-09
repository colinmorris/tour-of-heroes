// We're really trying this, huh?

import { Injectable } from '@angular/core';

import { SkillMap, Klass, KLASSES } from '../core/index';

@Injectable()
export class KlassService {

    starterKlass = "Peasant";
    private klassMap : {[name:string] : Klass};
    constructor(
    ) {
        this.klassMap = <{[name:string] : Klass}>{};
        for (let klass of KLASSES) {
            this.klassMap[klass.name] = klass;
        }
    }

    aptitudesForKlass(klass: string) : SkillMap {
        return this.klassMap[klass].aptitudes;
    }

}
