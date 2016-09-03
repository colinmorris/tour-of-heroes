"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var perk_1 = require('../perk');
var di_tokens_1 = require('../../shared/di-tokens');
var index_1 = require('../../core/index');
var buffs_defns_1 = require('./buffs.defns');
var OnOffPerk = (function (_super) {
    __extends(OnOffPerk, _super);
    function OnOffPerk() {
        _super.apply(this, arguments);
        this._active = false;
    }
    Object.defineProperty(OnOffPerk.prototype, "active", {
        get: function () { return this._active; },
        set: function (newValue) {
            if (this._active == newValue) {
                return;
            }
            this._active = newValue;
            if (newValue) {
                this.onActivate();
            }
            else {
                this.onDeactivate();
            }
        },
        enumerable: true,
        configurable: true
    });
    return OnOffPerk;
}(perk_1.AbstractPassive));
var WatcherPassive = (function (_super) {
    __extends(WatcherPassive, _super);
    function WatcherPassive() {
        _super.apply(this, arguments);
    }
    WatcherPassive.prototype.cleanUp = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this.sub.unsubscribe();
    };
    return WatcherPassive;
}(perk_1.AbstractPassive));
var ActionWatcherPassive = (function (_super) {
    __extends(ActionWatcherPassive, _super);
    function ActionWatcherPassive() {
        _super.apply(this, arguments);
        this.diTokens = [di_tokens_1.di_tokens.actionservice];
    }
    ActionWatcherPassive.prototype.onCast = function (AS) {
        var _this = this;
        this.sub = AS.protoActionOutcomeSubject
            .filter(function (proto) { return _this.filter(proto); })
            .subscribe(function (proto) { return _this.onAction(proto); });
    };
    return ActionWatcherPassive;
}(WatcherPassive));
/** Passives that boost actions performed in a particular zone. **/
var HomeZonePassive = (function (_super) {
    __extends(HomeZonePassive, _super);
    function HomeZonePassive() {
        _super.apply(this, arguments);
    }
    HomeZonePassive.prototype.filter = function (proto) {
        return proto.zone.name == this.constructor.zone;
    };
    HomeZonePassive.prototype.onAction = function (proto) {
        proto.spMultiplier += this.constructor.spMultiplier;
    };
    return HomeZonePassive;
}(ActionWatcherPassive));
/** It's interesting to note that passives that modify the player object don't
    actually need to worry about a cleanup phase (as long as we assume that passives
    will never be dismissed until reincarnation, which is sort of their definition),
    because the player object is destroyed and reborn on reincarnation.
**/
var MetadataPassive = (function (_super) {
    __extends(MetadataPassive, _super);
    function MetadataPassive() {
        _super.apply(this, arguments);
        this.diTokens = [di_tokens_1.di_tokens.playerservice];
    }
    MetadataPassive.prototype.onCast = function (PS) {
        this.fiddle(PS.player.meta);
    };
    MetadataPassive.prototype.cleanUp = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        // Yay, nothing to do here.
    };
    return MetadataPassive;
}(perk_1.AbstractPassive));
var PASSIVES;
(function (PASSIVES) {
    var AncestryPerk = (function (_super) {
        __extends(AncestryPerk, _super);
        function AncestryPerk() {
            _super.apply(this, arguments);
            this.diTokens = [di_tokens_1.di_tokens.statsservice, di_tokens_1.di_tokens.playerservice];
        }
        Object.defineProperty(AncestryPerk.prototype, "description", {
            get: function () {
                return "Base aptitudes increased by " + index_1.formatPct(this.multiplier);
            },
            enumerable: true,
            configurable: true
        });
        AncestryPerk.prototype.onCast = function (SS, PS) {
            var multiplier = index_1.ancestryBonus(SS.maxLevels());
            if (multiplier <= 0) {
                return false;
            }
            this.multiplier = multiplier;
            this.appliedBuffs = PS.getBaseAptitudes().map(function (apt) { return apt * multiplier; });
            PS.buffAptitudes(this.appliedBuffs);
            return true;
        };
        AncestryPerk.prototype.cleanUp = function (SS, PS) {
            PS.debuffAptitudes(this.appliedBuffs);
        };
        // TODO: Maybe it makes sense to use these classes just for defining behavior,
        // and define some structs in a separate file for stuff like name, description,
        // and future metadata (e.g. path to image for icon).
        AncestryPerk.sname = "Heroic Ancestry";
        AncestryPerk.sdescription = "Base aptitudes increased according to max level attained for each class";
        return AncestryPerk;
    }(perk_1.AbstractPassive));
    PASSIVES.AncestryPerk = AncestryPerk;
    var ClericPerk = (function (_super) {
        __extends(ClericPerk, _super);
        function ClericPerk() {
            _super.apply(this, arguments);
            this.diTokens = [di_tokens_1.di_tokens.actionservice];
        }
        ClericPerk.prototype.onCast = function (AS) {
            AS.inexpMultiplier = ClericPerk.inexpMultiplier;
        };
        ClericPerk.prototype.cleanUp = function (AS) {
            AS.inexpMultiplier = 1.0; // TODO: brittle
        };
        ClericPerk.sname = "Grace";
        ClericPerk.inexpMultiplier = .5;
        ClericPerk.sdescription = "Reduces slowdown for difficult zones by " + (1 - ClericPerk.inexpMultiplier) * 100 + "%";
        return ClericPerk;
    }(perk_1.AbstractPassive));
    PASSIVES.ClericPerk = ClericPerk;
    var BlobPerk = (function (_super) {
        __extends(BlobPerk, _super);
        function BlobPerk() {
            _super.apply(this, arguments);
            this.diTokens = [di_tokens_1.di_tokens.actionservice];
        }
        BlobPerk.prototype.onCast = function (AS) {
            this.sub = AS.protoActionOutcomeSubject.subscribe(function (proto) {
                if (AS.currentAction.slowdown > 1) {
                    console.log("Getting blobby");
                    proto.spMultiplier += BlobPerk.spMultiplier;
                }
            });
        };
        BlobPerk.sname = "Sessile";
        BlobPerk.spMultiplier = .5;
        BlobPerk.sdescription = "Increase skill gains by " + BlobPerk.spMultiplier * 100 + "% for actions with a slowdown penalty";
        return BlobPerk;
    }(WatcherPassive));
    PASSIVES.BlobPerk = BlobPerk;
    var StudentPerk = (function (_super) {
        __extends(StudentPerk, _super);
        function StudentPerk() {
            _super.apply(this, arguments);
            this.diTokens = [di_tokens_1.di_tokens.actionservice];
            this.prob = .1;
        }
        StudentPerk.prototype.onCast = function (AS) {
            var _this = this;
            this.sub = AS.protoActionOutcomeSubject
                .filter(function (outcome) {
                var intGain = outcome.action.skillDeltas[index_1.SkillType.Intellect];
                return (intGain == 0 || intGain == undefined)
                    && (Math.random() <= _this.prob);
            })
                .subscribe(function (proto) {
                console.log("Adding student kicker");
                var bonusPoints = index_1.zeroSkillMap();
                var mainPointGains = proto.action.skillDeltas
                    .reduce(function (prev, curr) { return prev + curr; }, 0);
                bonusPoints[index_1.SkillType.Intellect] = mainPointGains;
                var kicker = {
                    description: "Earned some extra credit",
                    skillPoints: bonusPoints
                };
                proto.kickers.push(kicker);
            });
        };
        StudentPerk.sname = "Extra Credit";
        StudentPerk.sdescription = "Chance to also increase Intellect when training other skills";
        return StudentPerk;
    }(WatcherPassive));
    PASSIVES.StudentPerk = StudentPerk;
    var FarmerPerk = (function (_super) {
        __extends(FarmerPerk, _super);
        function FarmerPerk() {
            _super.apply(this, arguments);
            this.diTokens = [di_tokens_1.di_tokens.actionservice, di_tokens_1.di_tokens.perkservice];
            this.prob = .1;
        }
        FarmerPerk.prototype.onCast = function (AS, PS) {
            var _this = this;
            this.sub = AS.protoActionOutcomeSubject
                .filter(function (outcome) {
                var farmGain = outcome.action.skillDeltas[index_1.SkillType.Farming];
                return (farmGain > 0)
                    && (Math.random() <= _this.prob);
            })
                .subscribe(function (proto) {
                // Apply the buff
                var buff = buffs_defns_1.BUFFS.Fruity.randomFruity(_this.injector);
                PS.addBuffObject(buff);
                // Let the world know
                var kicker = { description: "Ate some fruit. Delicious!\n                    (" + index_1.SkillType[buff.buffedSkill] + " skill temporarily increased)" };
                proto.kickers.push(kicker);
            });
        };
        FarmerPerk.sname = "Frugivore";
        FarmerPerk.sdescription = "Chance to eat a piece of fruit after performing a farming action, temporarily boosting the level of a random skill.";
        return FarmerPerk;
    }(WatcherPassive));
    PASSIVES.FarmerPerk = FarmerPerk;
    var ChocobonePerk = (function (_super) {
        __extends(ChocobonePerk, _super);
        function ChocobonePerk() {
            _super.apply(this, arguments);
        }
        ChocobonePerk.prototype.fiddle = function (meta) {
            meta.clickCritRate = ChocobonePerk.critRate;
            meta.clickCritMultiplier = ChocobonePerk.critMultiplier;
        };
        ChocobonePerk.sname = "Impactful Clicks";
        ChocobonePerk.critRate = .1;
        ChocobonePerk.critMultiplier = 5;
        ChocobonePerk.sdescription = ChocobonePerk.critRate * 100 + "% chance of a critical click with " + ChocobonePerk.critMultiplier * 100 + "% increased power";
        return ChocobonePerk;
    }(MetadataPassive));
    PASSIVES.ChocobonePerk = ChocobonePerk;
    var SkeletonPerk = (function (_super) {
        __extends(SkeletonPerk, _super);
        function SkeletonPerk() {
            _super.apply(this, arguments);
        }
        SkeletonPerk.prototype.fiddle = function (meta) {
            meta.clickMultiplier += SkeletonPerk.clickMultiplier;
        };
        SkeletonPerk.sname = "Strong Phalanges";
        SkeletonPerk.clickMultiplier = .5;
        SkeletonPerk.sdescription = "Base clicking power increased by " + SkeletonPerk.clickMultiplier * 100 + "%";
        return SkeletonPerk;
    }(MetadataPassive));
    PASSIVES.SkeletonPerk = SkeletonPerk;
    var RangerPerk = (function (_super) {
        __extends(RangerPerk, _super);
        function RangerPerk() {
            _super.apply(this, arguments);
        }
        RangerPerk.prototype.fiddle = function (meta) {
            meta.critChance += RangerPerk.critChance;
        };
        RangerPerk.sname = "Keen Eyes";
        RangerPerk.critChance = .1;
        RangerPerk.sdescription = RangerPerk.critChance * 100 + "% increased chance for critical actions (SP gains doubled)";
        return RangerPerk;
    }(MetadataPassive));
    PASSIVES.RangerPerk = RangerPerk;
    var ArcherPerk = (function (_super) {
        __extends(ArcherPerk, _super);
        function ArcherPerk() {
            _super.apply(this, arguments);
        }
        ArcherPerk.prototype.fiddle = function (meta) {
            meta.critChance += ArcherPerk.critChance;
            meta.critMultiplier += ArcherPerk.critMultiplierPlus;
        };
        ArcherPerk.sname = "Elf Eyes";
        ArcherPerk.critChance = .05;
        ArcherPerk.critMultiplierPlus = 1.0;
        ArcherPerk.sdescription = ArcherPerk.critChance * 100 + "% increased chance for critical actions and increases critical action multiplier another 100%";
        return ArcherPerk;
    }(MetadataPassive));
    PASSIVES.ArcherPerk = ArcherPerk;
    var PeasantPerk = (function (_super) {
        __extends(PeasantPerk, _super);
        function PeasantPerk() {
            _super.apply(this, arguments);
            this.diTokens = [di_tokens_1.di_tokens.playerservice];
        }
        PeasantPerk.prototype.onCast = function (PS) {
            var _this = this;
            this.PS = PS;
            this.sub = PS.playerLevel$.subscribe(function (level) {
                _this.active = level < PeasantPerk.levelThreshold;
            });
        };
        PeasantPerk.prototype.onActivate = function () {
            var apts = this.PS.getBaseAptitudes();
            this.aptitudeBuffs = apts.map(function (apt) { return apt * PeasantPerk.aptMultiplier; });
            this.PS.buffAptitudes(this.aptitudeBuffs);
        };
        PeasantPerk.prototype.onDeactivate = function () {
            console.log("Peasant perk going away now");
            this.sub.unsubscribe();
            this.PS.debuffAptitudes(this.aptitudeBuffs);
        };
        PeasantPerk.prototype.cleanUp = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (this.active) {
                this.onDeactivate();
            }
        };
        // TODO: wish there was a way I could get the compiler to bug me if
        // name/desc isn't given (i.e. make them "abstract" properties)
        PeasantPerk.sname = "Underdog";
        PeasantPerk.levelThreshold = 10;
        PeasantPerk.aptMultiplier = 3.0;
        // TODO: Is it possible to store a string property that uses something like
        // angular's templating syntax, and sort of 'eval' that in a template?
        // In particular, it'd be nice to be able to use pipes here.
        PeasantPerk.sdescription = "Base aptitudes increased by " + PeasantPerk.aptMultiplier * 100 + "% until level " + PeasantPerk.levelThreshold;
        return PeasantPerk;
    }(OnOffPerk));
    PASSIVES.PeasantPerk = PeasantPerk;
    var GladiatorPerk = (function (_super) {
        __extends(GladiatorPerk, _super);
        function GladiatorPerk() {
            _super.apply(this, arguments);
            this.diTokens = [di_tokens_1.di_tokens.actionservice];
        }
        GladiatorPerk.prototype.onCast = function (AS) {
            this.sub = AS.protoActionOutcomeSubject
                .filter(function (proto) {
                return proto.zone.name == 'Colloseum';
            })
                .subscribe(function (proto) {
                proto.spMultiplier += GladiatorPerk.spMultiplier;
            });
        };
        GladiatorPerk.sname = "Pit Fighter";
        GladiatorPerk.spMultiplier = .5;
        GladiatorPerk.sdescription = "SP gains increased by " + GladiatorPerk.spMultiplier * 100 + "% when adventuring in the Colloseum";
        return GladiatorPerk;
    }(WatcherPassive));
    PASSIVES.GladiatorPerk = GladiatorPerk;
    var HorsemanPerk = (function (_super) {
        __extends(HorsemanPerk, _super);
        function HorsemanPerk() {
            _super.apply(this, arguments);
            this.diTokens = [di_tokens_1.di_tokens.actionservice];
        }
        HorsemanPerk.prototype.onCast = function (AS) {
            this.sub = AS.protoActionOutcomeSubject
                .filter(function (proto) {
                return proto.zone.name == 'Stables';
            })
                .subscribe(function (proto) {
                proto.spMultiplier += HorsemanPerk.spMultiplier;
            });
        };
        HorsemanPerk.sname = "Stability";
        HorsemanPerk.spMultiplier = .5;
        HorsemanPerk.sdescription = "SP gains increased by " + HorsemanPerk.spMultiplier * 100 + "% when adventuring in the Stables";
        return HorsemanPerk;
    }(WatcherPassive));
    PASSIVES.HorsemanPerk = HorsemanPerk;
    var WoodsmanPerk = (function (_super) {
        __extends(WoodsmanPerk, _super);
        function WoodsmanPerk() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(WoodsmanPerk, "sdescription", {
            get: function () {
                return "SP gains increased by " + this.spMultiplier * 100 + "% when adventuring in the " + this.zone;
            },
            enumerable: true,
            configurable: true
        });
        WoodsmanPerk.sname = "Dendrophile";
        WoodsmanPerk.zone = "Woody Woods";
        WoodsmanPerk.spMultiplier = .5;
        return WoodsmanPerk;
    }(HomeZonePassive));
    PASSIVES.WoodsmanPerk = WoodsmanPerk;
    /** TODO: This is really just a placeholder. Would like to replace it with
    something less lame (see todo in klass.data.ts). **/
    var JousterPerk = (function (_super) {
        __extends(JousterPerk, _super);
        function JousterPerk() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(JousterPerk, "sdescription", {
            get: function () {
                return "SP gains increased by " + this.spMultiplier * 100 + "% when adventuring in the " + this.zone;
            },
            enumerable: true,
            configurable: true
        });
        JousterPerk.sname = "Jousty";
        JousterPerk.zone = "Tournament";
        JousterPerk.spMultiplier = .5;
        return JousterPerk;
    }(HomeZonePassive));
    PASSIVES.JousterPerk = JousterPerk;
})(PASSIVES = exports.PASSIVES || (exports.PASSIVES = {}));
//# sourceMappingURL=passives.defns.js.map