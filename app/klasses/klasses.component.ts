import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ActionService } from '../actions/action.service';
import { PerkService } from '../perks/perk.service';
import { PlayerService } from '../player/player.service';
import { LiveKlass, KlassService } from './klass.service';
import { StatsService } from '../stats/stats.service';

import { SkillComponent } from '../shared/skill.component';

import { SkillType, NamedUnlock } from '../core/index';
import { GLOBALS } from '../globals';

@Component({
    selector: 'klass-viewer',
    directives: [SkillComponent],
    styles: [
        `.focal img {
            width: 216px;
        }
        img.locked {
            -webkit-filter: contrast(0);
        }
        ul {
            list-style: none;
        }
        .reincarnate-button {
            margin-top: 20px;
            margin-bottom: 20px;
        }
        `
    ],
    template: `
        <div class="row">

        <div class="col-xs-4">
        <div *ngIf="selected" class="focal">
            <h2>{{displayName(selected)}}</h2>
            <img [src]="'/assets/units/' + selected.img"
                [class.locked]="!selected.unlocked">

            <h3><span class="label label-default">Aptitudes</span></h3>
            <div class="apts">
                <span *ngFor="let apt of selected.aptitudes; let i = index">
                <skill [skill]="i"></skill>{{apt}}
                <br *ngIf="i==3">
                </span>
            </div>

            <div *ngIf="selected.unlocked">
            <h3><span class="label label-default">Perk</span></h3>
            <p><b>{{Perks.perkForKlass(selected.name).sname}}</b>
                {{Perks.perkForKlass(selected.name).sdescription}}
            </p>
            </div>

            <button *ngIf="selected.unlocked || cheatMode"
                class="btn btn-default reincarnate-button center-block"
                (click)="reincarnate()">
                    Reincarnate!
            </button>
            <div *ngIf="!selected.unlocked">
                <p *ngIf="selected.progress !== undefined">
                    Unlock progress: {{selected.progress | percent:'1.0-0'}}
                </p>

            </div>
        </div>
        </div>

        <div class="col-xs-8">
            <div class="row">
                <div *ngFor="let klass of KS.allKlasses"
                    class="col-xs-2"
                >
                    <img [src]="'/assets/units/' + klass.img"
                        [class.locked]="!klass.unlocked">
                    <div>
                    <a (click)="selected=klass">{{displayName(klass)}}</a>
                    </div>
                </div>
            </div>
        </div>

        </div>
    `
})
export class KlassesComponent {
    selected: LiveKlass;
    ST = SkillType;
    cheatMode = GLOBALS.cheatMode;
    constructor (
        private KS: KlassService,
        private PS: PlayerService,
        private AS: ActionService,
        private Perks: PerkService,
        private Stats: StatsService,
        private router: Router
    ) {
    }

    displayName(klass: LiveKlass) {
        return klass.unlocked ? klass.name : "???";
    }

    reincarnate() {
        /** Reincarnation todo list:
        - stop any currently running actions
        - clear inventory
        - remove all buffs and perks
        - create a new player object and assign the appropriate perks (taken
            care of by player service)
        */
        // TODO: Should also reset the focal zone (incl. clearing currentAction/lastOutcome)
        this.AS.stopAllActions();

        /** TODO: This is kind of lame. Should try to find a more appropriate
        place for this logic at some point. **/
        if (
            (!this.Stats.unlocked(NamedUnlock.Pacifist)) &&
            (this.PS.player.level >= 10) &&
            (this.PS.player.skills[SkillType.Combat].baseLevel < 1)
        ) {
            this.Stats.unlock(NamedUnlock.Pacifist);
        }

        this.Perks.resetAllPerks();
        this.PS.reincarnate(this.selected.name);
        this.router.navigate(['/']);
    }
}
