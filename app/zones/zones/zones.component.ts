import { Input, Component, OnInit } from '@angular/core';

import { TickerService } from '../../ticker';

import { Zone, ZONES } from '../shared';
import { ZoneComponent } from '../zone';

import { SkillType, Skill } from '../../skills';

import { GLOBALS } from '../../globals';

@Component({
    selector: 'zones',
    directives: [ZoneComponent],
    template: `
    <div class="zones">
        <div *ngFor="let zone of zones">
            <zone 
                [zone]="zone" 
                >
            </zone>
        </div>
    </div>
    `
})

export class ZonesComponent implements OnInit {
    @Input() superzone : string;
    get zones() : Zone[] {
        return ZONES[this.superzone];
    }

    constructor(
        private tickerService: TickerService
    ) {
    }
    
    ngOnInit() {
    }

}

