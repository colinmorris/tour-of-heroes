import { AbstractPassive } from '../perk';
import { di_tokens } from '../../shared/di-tokens';
import { SkillMap, zeroSkillMap, SkillType,
    ProtoActionOutcome, ActionEvent, SecondaryAction
} from '../../core/index';
import { Observable } from 'rxjs/Observable';

import { IPlayerService } from '../../player/player.service.interface';
import { IStatsService } from '../../stats/stats.service.interface';
import { IActionService } from '../../actions/action.service.interface';

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

export class AncestryPerk extends AbstractPassive {
    // TODO: Maybe it makes sense to use these classes just for defining behavior,
    // and define some structs in a separate file for stuff like name, description,
    // and future metadata (e.g. path to image for icon).
    name = "Heroic Ancestry";
    diTokens = [di_tokens.statsservice, di_tokens.playerservice];
    private multiplier : number;
    get description() {
        return `Base aptitudes multiplied by ${this.multiplier}`;
    }
    onCast(SS: IStatsService, PS: IPlayerService) : boolean {
        let maxLvls = SS.maxLevelPerKlass();
        let multiplier = 1;
        for (let klass in maxLvls) {
            multiplier *= (1 + AncestryPerk.multiplierForLevel(maxLvls[klass]));
        }
        multiplier -= 1;
        if (multiplier <= 0) {
            return false;
        }
        let buffs = PS.getBaseAptitudes().map( (apt: number) => apt * multiplier );
        PS.buffAptitudes(buffs);
        return true;
    }

    static multiplierForLevel(level: number) : number {
        if (level <= 0) {
            return 0;
        }
        return Math.log10(level);
    }
}

export class StudentPerk extends AbstractPassive {
    name = "Extra Credit"
    diTokens = [di_tokens.actionservice];
    private prob = .1;
    description = "zzzz"
    onCast(AS: IActionService) {
        AS.protoActionOutcomeSubject
            .filter( (outcome: ProtoActionOutcome) => {
                let intGain = outcome.action.skillDeltas[SkillType.Intellect];
                return (intGain == 0 || intGain == undefined)
                    && (Math.random() <= this.prob);
            })
            .subscribe( (proto: ProtoActionOutcome) => {
                console.log("Adding student kicker");
                let bonusPoints = zeroSkillMap();
                let mainPointGains = proto.action.skillDeltas
                    .reduce( (prev, curr) => prev+curr, 0);
                bonusPoints[SkillType.Intellect] = mainPointGains;
                let kicker:SecondaryAction = {
                    description: `Earned some extra credit`,
                    skillPoints: bonusPoints
                };
                proto.kickers.push(kicker);
            });
    }
}



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

/**
class RangerPerk {
    private sub: any;
    buff(AS: ActionService) {
        // This is not particularly satisfying, but it might do. Assuming it works.
        this.sub = AS.actionEffectSubject.subscribe(
            (eff: ActionEffect) => {
                if (AS.activeZone.zid == 1) {
                    console.log("Ranger perk doubling skill gains");
                    eff.skillPoints = eff.skillPoints.map( (x) => { return x * 2; });
                }
            }
        )
    }
    cleanup(AS: ActionService) {
        this.sub.unsubscribe();
    }
}
**/

}
