"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
class BaseError extends Error {
    constructor(message, payload = {}) {
        super(`${constants_1.ICONS.ERROR} ${message}`);
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, BaseError);
        }
        this.payload = payload;
        this.timestamp = new Date();
    }
}
exports.BaseError = BaseError;
exports.default = BaseError;
//# sourceMappingURL=BaseError.js.map