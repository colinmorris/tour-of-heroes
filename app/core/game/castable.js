"use strict";
// TODO: rename me
var InjectedArgs = (function () {
    function InjectedArgs(injector) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.injector = injector;
    }
    InjectedArgs.prototype.injectionArgs = function () {
        var args = [];
        for (var _i = 0, _a = this.diTokens; _i < _a.length; _i++) {
            var token = _a[_i];
            var service = this.injector.get(token);
            args.push(service);
        }
        return args;
    };
    return InjectedArgs;
}());
exports.InjectedArgs = InjectedArgs;
//# sourceMappingURL=castable.js.map