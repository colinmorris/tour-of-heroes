"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var player_service_1 = require('../player/player.service');
var index_1 = require('../core/index');
var spells_defns_1 = require('./defns/spells.defns');
var passives_defns_1 = require('./defns/passives.defns');
var buffs_defns_1 = require('./defns/buffs.defns');
var deferral_time = 100; // idk
var PerkService = (function () {
    function PerkService(PS, injector) {
        this.PS = PS;
        this.injector = injector;
        this.resetAllPerks();
        this.addPerkForKlass(PS.player.klass, true);
        this.addAncestryPerk(true);
    }
    PerkService.prototype.onReincarnate = function () {
        this.resetAllPerks();
    };
    PerkService.prototype.postReincarnate = function () {
        this.addPerkForKlass(this.PS.player.klass);
        this.addAncestryPerk();
    };
    PerkService.prototype.resetAllPerks = function () {
        /** Make sure buffs and passives clean up gracefully **/
        for (var buffname in this.buffs) {
            this.buffs[buffname].onDestroy();
        }
        for (var passiveName in this.passives) {
            this.passives[passiveName].onDestroy();
        }
        this.buffs = {};
        this.passives = {};
        this.spells = {};
    };
    PerkService.prototype.getSpells = function () {
        // Wait, really? I gotta do this?
        var res = new Array();
        for (var name_1 in this.spells) {
            res.push(this.spells[name_1]);
        }
        return res;
    };
    PerkService.prototype.getPassives = function () {
        var res = new Array();
        for (var name_2 in this.passives) {
            res.push(this.passives[name_2]);
        }
        return res;
    };
    PerkService.prototype.getBuffs = function () {
        var res = new Array();
        for (var name_3 in this.buffs) {
            res.push(this.buffs[name_3]);
        }
        return res;
    };
    PerkService.prototype.perkForKlass = function (klass) {
        var perkName = klass + 'Perk';
        if (perkName in spells_defns_1.SPELLS) {
            return spells_defns_1.SPELLS[perkName];
        }
        else if (perkName in passives_defns_1.PASSIVES) {
            var psv = passives_defns_1.PASSIVES[perkName];
            return psv;
        }
        else {
            console.warn("Couldn't find a perk for " + klass);
        }
    };
    /** If defer is true, then wait a little bit before adding. This must be
    set if this is called from the constructor of a service, because running
    synchronously in that case will lead to a horrible infinite loop.
    (The timer-based solution is kind of a dumb hack. Should probably listen
    for an event fired when the app component is done loading. Or something.) **/
    PerkService.prototype.addPerkForKlass = function (klass, defer) {
        var _this = this;
        if (defer === void 0) { defer = false; }
        /** TODO: this is very brittle. At the very least, should iterate through
        all known classes on initialization and assert that their corresponding
        perk exists. **/
        var perkName = klass + 'Perk';
        var add = function () {
            _this.addPerkByName(perkName);
        };
        if (defer) {
            setTimeout(add, deferral_time);
        }
        else {
            add();
        }
    };
    PerkService.prototype.addPerkByName = function (name) {
        if (name in spells_defns_1.SPELLS) {
            this.addSpell(name);
        }
        else if (name in passives_defns_1.PASSIVES) {
            this.addPassive(name);
        }
        else {
            console.warn("Couldn't find perk with name " + name);
        }
    };
    PerkService.prototype.addAncestryPerk = function (defer) {
        var _this = this;
        if (defer === void 0) { defer = false; }
        if (defer) {
            setTimeout(function () { return _this.inner_addAncestryPerk(); }, deferral_time);
        }
        else {
            this.inner_addAncestryPerk();
        }
    };
    PerkService.prototype.inner_addAncestryPerk = function () {
        var ancestry = new passives_defns_1.PASSIVES.AncestryPerk(this.injector);
        var success = ancestry.apply();
        if (!success) {
            console.log("Not eligible for ancestry perk yet.");
        }
        else {
            this.passives["AncestryPerk"] = ancestry;
        }
    };
    PerkService.prototype.ancestryBonusForLevel = function (level) {
        return index_1.ancestryBonusForLevel(level);
    };
    PerkService.prototype.ancestryBonus = function (stats) {
        return index_1.ancestryBonus(stats.maxLevels());
    };
    PerkService.prototype.ancestryBonusWithSub = function (stats, subklass, level) {
        var maxLevels = new Array();
        maxLevels.push(level);
        var perKlass = stats.maxLevelPerKlass();
        for (var klass in perKlass) {
            // Ignore any previous max level for the given class
            if (klass != subklass) {
                maxLevels.push(perKlass[klass]);
            }
        }
        return index_1.ancestryBonus(maxLevels);
    };
    PerkService.prototype.addSpell = function (spellName) {
        console.assert(!(spellName in this.spells));
        var spell = new spells_defns_1.SPELLS[spellName](this.injector);
        this.spells[spellName] = spell;
    };
    PerkService.prototype.addPassive = function (passiveName) {
        console.assert(!(passiveName in this.passives));
        var passive = new passives_defns_1.PASSIVES[passiveName](this.injector);
        this.passives[passiveName] = passive;
        passive.apply();
    };
    /** TODO: I think this refactor to allow passing in additional constructor
    arguments was actually unnecessary. The thing that needs to add the buff
    (the passive, spell, item, whatever) should know which buff class it
    needs specifically, and just call some factory method of that class.
    */
    PerkService.prototype.addBuff = function (buffName) {
        var buffArgs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            buffArgs[_i - 1] = arguments[_i];
        }
        var buff = new ((_a = buffs_defns_1.BUFFS[buffName]).bind.apply(_a, [void 0].concat([this.injector], buffArgs)))();
        this.addBuffObject(buff);
        var _a;
    };
    /** If we're given a dupe of a currently-active buff, we'll refresh the
    duration, but not add a new instance of the buff.
    **/
    PerkService.prototype.addBuffObject = function (buff) {
        var _this = this;
        var buffid = buff.name;
        if (buffid in this.buffs) {
            this.buffs[buffid].refresh(buff);
        }
        else {
            this.buffs[buffid] = buff;
            buff.apply().then(function (resolved) {
                delete _this.buffs[buffid];
            });
        }
    };
    PerkService = __decorate([
        // idk
        core_1.Injectable(), 
        __metadata('design:paramtypes', [player_service_1.PlayerService, core_1.Injector])
    ], PerkService);
    return PerkService;
}());
exports.PerkService = PerkService;
//# sourceMappingURL=perk.service.js.map