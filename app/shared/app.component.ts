import { Component, OpaqueToken, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Observable } from 'rxjs/Observable';

//import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap/index';

import { PlayerService } from '../player/player.service';
import { Zones } from '../zones/zones.service';
import { ActionService } from '../actions/action.service';
import { KlassService } from '../klasses/klass.service';
import { PerkService } from '../perks/perk.service';
import { StatsService } from '../stats/stats.service';
import { SerializationService } from './serialization.service';

import '../rxjs-operators';
import { di_tokens } from './di-tokens';
import { GLOBALS } from '../globals';
import { NamedUnlock } from '../core/index';

@Component({
    selector: 'my-app',
    directives: [ ROUTER_DIRECTIVES ],
    styles: [`
        .save {
            margin-top: 15px;
        }
        /* TODO: this is hacky in every respect */
        >>> .toast-klassname {
            margin-left: 110px;
        }
    `],
    template: `
    <span defaultOverlayTarget></span>
    <simple-notifications></simple-notifications>
    <div class="container">
    <ul class="nav nav-pills">
        <li [routerLinkActive]="['active']" [routerLinkActiveOptions]="{exact:true}">
            <a [routerLink]="['/']">Home</a></li>
        <li [routerLinkActive]="['active']"><a [routerLink]="['/classes']">Classes</a></li>
        <li [routerLinkActive]="['active']"><a [routerLink]="['/stats']">Stats</a></li>
        <li [routerLinkActive]="['active']"><a [routerLink]="['/about']">About</a></li>
        <li [routerLinkActive]="['active']"><a [routerLink]="['/debug']" *ngIf="cheatMode">Debug</a></li>
    </ul>
    <router-outlet></router-outlet>
    <div class="row save" *ngIf="cheatMode">
    <button (click)="serials.save()">Save</button>
    <button (click)="serials.clearSave()">Clear Save</button>
    </div>
    </div>
  `,
    providers: [Modal,
        Zones, KlassService, SerializationService,
        StatsService,
        {provide: di_tokens.statsservice, useExisting: StatsService},
        PerkService,
        {provide: di_tokens.perkservice, useExisting: PerkService},
        PlayerService,
        {provide: di_tokens.playerservice, useExisting: PlayerService},
        ActionService,
        {provide: di_tokens.actionservice, useExisting: ActionService}
    ]
})
export class AppComponent implements OnInit {
    cheatMode: boolean = GLOBALS.cheatMode;
    private lvl10sub: any;
    constructor(
        private serials: SerializationService,
        private Stats: StatsService,
        private PS: PlayerService,
        private KS: KlassService,
        public modal: Modal
    ) {

    }

    ngOnInit() {
        if (GLOBALS.autoSave) {
            Observable.interval(GLOBALS.autoSaveIntervalMs).subscribe( () => {
                this.serials.save();
            });
        }

        if (!this.Stats.unlocked(NamedUnlock.ReincarnationAvailableHelp)) {
            this.lvl10sub = this.PS.playerLevel$.subscribe( (lvl) => {
                if (lvl == GLOBALS.reincarnationMinLevel) {
                    this.reincarnationModal();
                    this.Stats.unlock(NamedUnlock.ReincarnationAvailableHelp);
                    this.lvl10sub.unsubscribe();
                }
            });
        }

    }

    reincarnationModal() {
        /** TODO: Anchor links to Classes pane don't really work here, since
        they cause a page reload. Boo. Maybe I should just use hashtag
        navigation. Would also help with some of the quirks that come
        with gh-pages + single page sites.
        **/
        let s = this.KS.nUnlocked > 1 ?
            `Looks like you've already unlocked a new class. Head over to the
            Classes tab to start a new life. Or if you have no desire for
            upward mobility, feel free to keep living that Peasant life...`
            :
            `Looks like you haven't unlocked any classes yet. Head over to the
            Classes tab for some unlock hints. If you really want, you can
            reincarnate into a level 1 Peasant (also in Classes)
            and start again with a slight boost to your aptitudes.`;
        this.modal.alert()
            .size('lg')
            .showClose(true)
            .title(`Level ${GLOBALS.reincarnationMinLevel}!`)
            .body(`<p>Congratulations on reaching level ${GLOBALS.reincarnationMinLevel}.
                You're ready to <b>reincarnate</b>. Reincarnation lets you live a
                new life as a different class. After your first reincarnation, you'll
                start receiving a boost to your aptitudes based on the highest level
                you've reached with each class - it pays to unlock and level as
                many classes as possible.</p>
                <p>${s}</p>
                `).open();
    }
}
