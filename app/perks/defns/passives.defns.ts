import { AbstractPassive } from '../perk';
import { di_tokens } from '../../shared/di-tokens';
import { SkillMap } from '../../core/index';
import { Observable } from 'rxjs/Observable';
import { IPlayerService } from '../../player/player.service.interface';

abstract class OnOffPerk extends AbstractPassive {
    private _active: boolean;
    get active() { return this._active; }
    set active(newValue: boolean) {
        if (this._active == newValue) { return; }
        this._active = newValue;
        if (newValue) {
            this.onActivate();
        } else {
            this.onDeactivate();
        }
    }
    abstract onActivate();
    abstract onDeactivate();

}

export namespace PASSIVES {

export class PeasantPerk extends OnOffPerk {
    // TODO: wish there was a way I could get the compiler to bug me if
    // name/desc isn't given (i.e. make them "abstract" properties)
    name = "Underdog";
    private levelThreshold = 2;
    description = `Base aptitudes are doubled until level ${this.levelThreshold}`;
    diTokens = [di_tokens.playerservice];
    private sub: any;
    private aptitudeBuffs: SkillMap;
    private PS: IPlayerService;
    onCast(PS: IPlayerService) {
        this.PS = PS;
        this.sub = PS.playerLevel$.subscribe( (level) => {
            this.active = level < this.levelThreshold;
        });
    }

    onActivate() {
        let apts: SkillMap = this.PS.getBaseAptitudes();
        this.aptitudeBuffs = apts;
        this.PS.buffAptitudes(apts);
    }
    onDeactivate() {
        console.log("Peasant perk going away now");
        this.sub.unsubscribe();
        let mirrorBuffs = this.aptitudeBuffs.map( (x) => { return -x;} );
        this.PS.buffAptitudes(mirrorBuffs);
    }
}

}
