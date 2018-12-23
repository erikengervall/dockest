"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
class ConfigurationError extends Error {
    constructor(message) {
        super(`${constants_1.EMOJIS.ERROR} Invalid configuration: ${message}}`);
    }
}
exports.ConfigurationError = ConfigurationError;
exports.default = ConfigurationError;
