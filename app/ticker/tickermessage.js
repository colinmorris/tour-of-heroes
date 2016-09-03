"use strict";
var TickerMessage = (function () {
    function TickerMessage(text, priority) {
        this.text = text;
        this.priority = priority;
    }
    return TickerMessage;
}());
exports.TickerMessage = TickerMessage;
(function (TickerMessagePriority) {
    TickerMessagePriority[TickerMessagePriority["Info"] = 3] = "Info";
    TickerMessagePriority[TickerMessagePriority["Important"] = 5] = "Important";
    TickerMessagePriority[TickerMessagePriority["Teachable"] = 7] = "Teachable";
})(exports.TickerMessagePriority || (exports.TickerMessagePriority = {}));
var TickerMessagePriority = exports.TickerMessagePriority;
//# sourceMappingURL=tickermessage.js.map