"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseVerb = (function () {
    function BaseVerb(base) {
        this.base = base;
    }
    return BaseVerb;
}());
var RegularVerb = (function (_super) {
    __extends(RegularVerb, _super);
    function RegularVerb() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(RegularVerb.prototype, "pres", {
        get: function () { return this.base + "ing"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RegularVerb.prototype, "past", {
        get: function () { return this.base + "ed"; },
        enumerable: true,
        configurable: true
    });
    return RegularVerb;
}(BaseVerb));
var DoubleConsonantVerb = (function (_super) {
    __extends(DoubleConsonantVerb, _super);
    function DoubleConsonantVerb() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(DoubleConsonantVerb.prototype, "pres", {
        get: function () { return this.base + this.base[this.base.length - 1] + "ing"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DoubleConsonantVerb.prototype, "past", {
        get: function () { return this.base + this.base[this.base.length - 1] + "ed"; },
        enumerable: true,
        configurable: true
    });
    return DoubleConsonantVerb;
}(BaseVerb));
var FinalEVerb = (function (_super) {
    __extends(FinalEVerb, _super);
    function FinalEVerb() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(FinalEVerb.prototype, "pres", {
        get: function () { return this.base.slice(0, -1) + "ing"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FinalEVerb.prototype, "past", {
        get: function () { return this.base.slice(0, -1) + "ed"; },
        enumerable: true,
        configurable: true
    });
    return FinalEVerb;
}(BaseVerb));
var doubleConsonantVerbs = new Set(["chop", "ham", "chat"]);
var finalEVerbs = new Set([
    "bale", "dance", "decode", "exorcise", "dodge",
    "sermonize", "proselytize", "harmonize", "eulogize", "deface",
]);
var irregularVerbs = {
    "ride": { base: "ride", pres: "riding", past: "rode" },
    "read": { base: "read", pres: "reading", past: "read" },
    "fight": { base: "fight", pres: "fighting", past: "fought" },
    "tiptoe": { base: "tiptoe", pres: "tiptoeing", past: "tiptoed" },
    "light": { base: "light", pres: "lighting", past: "lit" },
    "swim": { base: "swim", pres: "swimming", past: "swam" },
    "free": { base: "free", pres: "freeing", past: "freed" },
    "steal": { base: "steal", pres: "stealing", past: "stole" },
    "sing": { base: "sing", pres: "singing", past: "sang" },
    "drive": { base: "drive", pres: "driving", past: "drove" },
};
function verbLookup(base) {
    if (doubleConsonantVerbs.has(base)) {
        return new DoubleConsonantVerb(base);
    }
    else if (finalEVerbs.has(base)) {
        return new FinalEVerb(base);
    }
    else if (base in irregularVerbs) {
        return irregularVerbs[base];
    }
    else {
        return new RegularVerb(base);
    }
}
exports.verbLookup = verbLookup;
//# sourceMappingURL=verb.js.map