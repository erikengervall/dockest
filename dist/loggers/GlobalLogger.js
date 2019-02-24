"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseLogger_1 = __importDefault(require("./BaseLogger"));
class GlobalLogger extends BaseLogger_1.default {
    constructor() {
        super();
        this.error = (message, logData) => this.LOG_LEVEL_ERROR && this.logError(message, logData);
        /**
         * Dockest
         */
        this.info = (m, d) => this.LOG_LEVEL_VERBOSE && this.logInfo(m, d);
        this.loading = (m, d) => this.LOG_LEVEL_NORMAL && this.logLoading(m, d);
        return GlobalLogger.globalLoggerInstance || (GlobalLogger.globalLoggerInstance = this);
    }
}
const globalLogger = new GlobalLogger();
exports.default = globalLogger;
//# sourceMappingURL=GlobalLogger.js.map