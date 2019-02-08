"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseLogger_1 = __importDefault(require("./BaseLogger"));
class GlobalLogger extends BaseLogger_1.default {
    constructor() {
        super();
        // Dockest
        this.info = (m, d) => this.IS_VERBOSE() && this.logInfo(m, d);
        // Dockest
        this.loading = (m, d) => this.IS_NORMAL() && this.logLoading(m, d);
        this.error = (message, logData) => this.IS_ERROR() && this.logError(message, logData);
        return GlobalLogger.globalLoggerInstance || (GlobalLogger.globalLoggerInstance = this);
    }
}
const globalLogger = new GlobalLogger();
exports.default = globalLogger;
//# sourceMappingURL=GlobalLogger.js.map