"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseLogger_1 = __importDefault(require("./BaseLogger"));
class JestLogger extends BaseLogger_1.default {
    constructor() {
        super();
        this.success = m => this.LOG_LEVEL_ERROR && this.logSuccess(m);
        this.failed = m => this.LOG_LEVEL_ERROR && this.logError(m);
        this.error = (m, e) => this.LOG_LEVEL_NORMAL && this.logError(m, e);
        return JestLogger.jestLoggerInstance || (JestLogger.jestLoggerInstance = this);
    }
}
const jestLogger = new JestLogger();
exports.default = jestLogger;
//# sourceMappingURL=JestLogger.js.map