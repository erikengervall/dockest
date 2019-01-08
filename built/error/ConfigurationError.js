"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
class ConfigurationError extends Error {
    constructor(message) {
        super(`${constants_1.ICONS.ERROR} Invalid configuration: ${message}}`);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ConfigurationError);
        }
    }
}
exports.ConfigurationError = ConfigurationError;
exports.default = ConfigurationError;
