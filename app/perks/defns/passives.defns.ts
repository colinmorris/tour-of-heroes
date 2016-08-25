import { AbstractPassive, AbstractBuff } from '../perk';
import { di_tokens } from '../../shared/di-tokens';
import { SkillMap, zeroSkillMap, SkillType,
    ProtoActionOutcome, ActionEvent, SecondaryAction,
    formatPct
} from '../../core/index';
import { Observable } from 'rxjs/Observable';
import { BUFFS } from './buffs.defns';

import { IPlayerService } from '../../player/player.service.interface';
import { IStatsService } from '../../stats/stats.service.interface';
import { IActionService } from '../../actions/action.service.interface';
import { IPerkService } from '../perk.service.interface';

abstract class OnOffPerk extends AbstractPassive {
    private _active: boolean = false;
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
    static sname = "Heroic Ancestry";
    diTokens = [di_tokens.statsservice, di_tokens.playerservice];
    private multiplier : number;
    private appliedBuffs: SkillMap;
    get description() {
        return `Base aptitudes multiplied by ${formatPct(this.multiplier)}`;
    }
    static sdescription = `Base aptitudes increased according to max level
        attained for each class`;
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
        this.multiplier = multiplier;
        this.appliedBuffs = PS.getBaseAptitudes().map( (apt: number) => apt * multiplier );
        PS.buffAptitudes(this.appliedBuffs);
        return true;
    }
    cleanUp(SS: IStatsService, PS: IPlayerService) {
        PS.debuffAptitudes(this.appliedBuffs);
    }

    static multiplierForLevel(level: number) : number {
        if (level <= 10) {
            return 0;
        }
        return Math.log10(level - 9);
    }
}

export class ClericPerk extends AbstractPassive {
    static sname = "Grace";
    static inexpMultiplier = .5;
    static sdescription = `Reduces speed penalty for difficult zones by
            ${(1 - ClericPerk.inexpMultiplier)*100}%`;
    diTokens = [di_tokens.actionservice];

    onCast(AS: IActionService) {
        AS.inexpMultiplier = ClericPerk.inexpMultiplier;
    }
    cleanUp(AS: IActionService) {
        AS.inexpMultiplier = 1.0; // TODO: brittle
    }
}

export class StudentPerk extends WatcherPassive {
    static sname = "Extra Credit";
    diTokens = [di_tokens.actionservice];
    private prob = .1;
    static sdescription = "zzzz";
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
    static sname = "Frugivore";
    static sdescription = `Chance to eat a piece of fruit after performing a farming
    action, temporarily boosting the level of a random skill.`;
    private prob = .1;
    onCast(AS: IActionService, PS: IPerkService) {
        this.sub = AS.protoActionOutcomeSubject
        .filter( (outcome: ProtoActionOutcome) => {
            let farmGain = outcome.action.skillDeltas[SkillType.Farming];
            return (farmGain > 0)
                && (Math.random() <= this.prob);
        })
        .subscribe( (proto: ProtoActionOutcome) => {
            // Apply the buff
            let buff:BUFFS.Fruity = BUFFS.Fruity.randomFruity(this.injector);
            PS.addBuffObject(buff);
            // Let the world know
            let kicker:SecondaryAction =
                {description: `Ate some fruit. Delicious!
                    (${SkillType[buff.buffedSkill]} skill temporarily increased)`};
            proto.kickers.push(kicker);
        });
    }
}

export class SkeletonPerk extends AbstractPassive {
    static sname = "Strong Phalanges";
    static clickMultiplier = .5;
    static sdescription = `Base clicking power increased by
        ${SkeletonPerk.clickMultiplier * 100}%`;
    diTokens = [di_tokens.playerservice];
    onCast(PS: IPlayerService) {
        PS.clickMultiplier += SkeletonPerk.clickMultiplier;
    }
    cleanUp(PS: IPlayerService) {
        PS.clickMultiplier -= SkeletonPerk.clickMultiplier;
    }

}

export class PeasantPerk extends OnOffPerk {
    // TODO: wish there was a way I could get the compiler to bug me if
    // name/desc isn't given (i.e. make them "abstract" properties)
    name = "Underdog";
    static sname = "Underdog";
    static levelThreshold = 10;
    static aptMultiplier = 3.0;
    // TODO: Is it possible to store a string property that uses something like
    // angular's templating syntax, and sort of 'eval' that in a template?
    // In particular, it'd be nice to be able to use pipes here.
    description = `Base aptitudes increased by ${PeasantPerk.aptMultiplier*100}%
        until level ${PeasantPerk.levelThreshold}`;
    static sdescription = `Base aptitudes increased by ${PeasantPerk.aptMultiplier*100}%
        until level ${PeasantPerk.levelThreshold}`;
    diTokens = [di_tokens.playerservice];
    private sub: any;
    private aptitudeBuffs: SkillMap;
    private PS: IPlayerService;
    onCast(PS: IPlayerService) {
        this.PS = PS;
        this.sub = PS.playerLevel$.subscribe( (level) => {
            this.active = level < PeasantPerk.levelThreshold;
        });
    }

    onActivate() {
        let apts: SkillMap = this.PS.getBaseAptitudes();
        this.aptitudeBuffs = apts.map( (apt) => apt * PeasantPerk.aptMultiplier );
        this.PS.buffAptitudes(this.aptitudeBuffs);
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

export class GladiatorPerk extends WatcherPassive {
    static sname = "Pit Fighter";
    static spMultiplier = .5;
    static sdescription = `SP gains increased by
        ${GladiatorPerk.spMultiplier*100}% when adventuring in the Colloseum`;
    diTokens = [di_tokens.actionservice];
    onCast(AS: IActionService) {
        this.sub = AS.protoActionOutcomeSubject
            .filter( (proto: ProtoActionOutcome) => {
                return proto.zone.name == 'Colloseum';
            })
            .subscribe( (proto: ProtoActionOutcome) => {
                proto.spMultiplier += GladiatorPerk.spMultiplier;
            });
    }
}

export class HorsemanPerk extends WatcherPassive {
    static sname = "Stability";
    static spMultiplier = .5;
    static sdescription = `SP gains increased by
        ${HorsemanPerk.spMultiplier*100}% when adventuring in the Colloseum`;
    diTokens = [di_tokens.actionservice];
    onCast(AS: IActionService) {
        this.sub = AS.protoActionOutcomeSubject
            .filter( (proto: ProtoActionOutcome) => {
                return proto.zone.name == 'Stables';
            })
            .subscribe( (proto: ProtoActionOutcome) => {
                proto.spMultiplier += HorsemanPerk.spMultiplier;
            });
    }
}

}
