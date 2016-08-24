import { AbstractPassive, AbstractBuff } from '../perk';
import { di_tokens } from '../../shared/di-tokens';
import { SkillMap, zeroSkillMap, SkillType,
    ProtoActionOutcome, ActionEvent, SecondaryAction
} from '../../core/index';
import { Observable } from 'rxjs/Observable';
import { BUFFS } from './buffs.defns';

import { IPlayerService } from '../../player/player.service.interface';
import { IStatsService } from '../../stats/stats.service.interface';
import { IActionService } from '../../actions/action.service.interface';
import { IPerkService } from '../perk.service.interface';

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

abstract class WatcherPassive extends AbstractPassive {
    protected sub: any;
    cleanUp(...args) {
        this.sub.unsubscribe();
    }
}

export namespace PASSIVES {

export class AncestryPerk extends AbstractPassive {
    // TODO: Maybe it makes sense to use these classes just for defining behavior,
    // and define some structs in a separate file for stuff like name, description,
    // and future metadata (e.g. path to image for icon).
    name = "Heroic Ancestry";
    diTokens = [di_tokens.statsservice, di_tokens.playerservice];
    private multiplier : number;
    private appliedBuffs: SkillMap;
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
        this.appliedBuffs = PS.getBaseAptitudes().map( (apt: number) => apt * multiplier );
        PS.buffAptitudes(this.appliedBuffs);
        return true;
    }
    cleanUp(SS: IStatsService, PS: IPlayerService) {
        PS.debuffAptitudes(this.appliedBuffs);
    }

    static multiplierForLevel(level: number) : number {
        if (level <= 0) {
            return 0;
        }
        return Math.log10(level);
    }
}

export class ClericPerk extends AbstractPassive {
    name = "Grace";
    description = "zooozozozozzzzz";
    diTokens = [di_tokens.actionservice];
    private inexpMultiplier = .5;
    onCast(AS: IActionService) {
        AS.inexpMultiplier = this.inexpMultiplier;
    }
    cleanUp(AS: IActionService) {
        AS.inexpMultiplier = 1.0; // TODO: brittle
    }
}

export class StudentPerk extends WatcherPassive {
    name = "Extra Credit"
    diTokens = [di_tokens.actionservice];
    private prob = .1;
    description = "zzzz"
    onCast(AS: IActionService) {
        this.sub = AS.protoActionOutcomeSubject
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

export class FarmerPerk extends WatcherPassive {
    diTokens = [di_tokens.actionservice, di_tokens.perkservice];
    name = "Frugivore";
    description = `Chance to eat a piece of fruit after performing a farming
    action, temporarily boosting the level of a random skill.`;
    private prob = .05;
    onCast(AS: IActionService, PS: IPerkService) {
        this.sub = AS.protoActionOutcomeSubject
        .filter( (outcome: ProtoActionOutcome) => {
            let farmGain = outcome.action.skillDeltas[SkillType.Farming];
            return (farmGain > 0)
                && (Math.random() <= this.prob);
        })
        .subscribe( (proto: ProtoActionOutcome) => {
            // Apply the buff
            let buff:AbstractBuff = BUFFS.Fruity.randomFruity(this.injector);
            PS.addBuffObject(buff);
            // Let the world know
            let kicker:SecondaryAction = {description: `Ate some fruit. Delicious!`};
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
        this.PS.debuffAptitudes(this.aptitudeBuffs);
    }
    cleanUp(...args) {
        if (this.active) {
            this.onDeactivate();
        }
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
