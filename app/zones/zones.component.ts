import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Zone } from '../core/index';
import { Zones } from './zones.service';
import { ZoneSummaryComponent } from './zone-summary.component';
import { PlayerService } from '../player/player.service';

interface SuperzonePane {
    name: string;
    unlocked: boolean;
    zones: Zone[];
}

@Component({
    selector: 'zones',
    directives: [ ZoneSummaryComponent ],
    styles: [
        `a {
            padding: 10px;
        }
        .zone-header {
            font-weight: bold;
        }
        .locked {
            opacity: .5; /* placeholder */
        }
        `,],
    template: `
    <div>

    <ul class="nav nav-tabs">
        <li *ngFor="let pane of panes"
        [class.active]="activePane==pane"
        [class.locked]="!pane.unlocked"
         >
            <a (click)="setActivePane(pane)">{{pane.name}}</a>
        </li>
    </ul>

    <div class="tab-content">
        <div *ngFor="let pane of panes"
         class="tab-pane"
         [class.active]="activePane==pane"
         >
            <ul *ngIf="activePane==pane" class="list-group">
                <li class="list-group-item zone-header">
                <div class="row">
                    <div class="col-xs-3">Zone</div>
                    <div class="col-xs-4">Skills</div>
                    <div class="col-xs-2">Slowdown</div>
                    <div class="col-xs-3"></div>
                </div>
                </li>

                <li *ngFor="let zone of pane.zones" class="list-group-item">
                    <zone-summary [zone]="zone">
                    </zone-summary>
                </li>
            </ul>
        </div>
    </div>

    </div>
    `
})
export class ZonesComponent implements OnInit {
    activePane: SuperzonePane;
    panes: SuperzonePane[] = new Array<SuperzonePane>();

    constructor(
        private zones: Zones,
        private PS: PlayerService
    ) {}

    ngOnInit() {
        console.assert(this.panes.length == 0);
        for (let superz of this.zones.superzones) {
            this.panes.push({
                name: superz.name, unlocked: superz.unlockCondition(this.PS.player.level),
                zones: superz.zones
            });
        }
        this.activePane = this.panes[0];
        console.assert(this.activePane.unlocked);

        // On level up, check whether any new superzones have been unlocked.
        this.PS.playerLevel$.subscribe( (lvl:number) => {
            for (let i=0; i < this.panes.length; i++) {
                this.panes[i].unlocked = this.zones.superzones[i].
                    unlockCondition(this.PS.player.level)
            }
        });
    }

    setActivePane(pane: SuperzonePane) {
        if (pane.unlocked) {
            this.activePane = pane;
        } else {
            console.warn(`${pane.name} is locked!`);
        }
    }

}
