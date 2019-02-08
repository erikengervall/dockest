"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseLogger_1 = __importDefault(require("./BaseLogger"));
class RunnerUtilsLogger extends BaseLogger_1.default {
    constructor() {
        super();
        this.customShellCmd = (runnerKey, cmd) => this.IS_NORMAL() && this.logLoading(`${runnerKey}: Executed custom command`, cmd);
        this.customShellCmdSuccess = (runnerKey, logData) => this.IS_NORMAL() &&
            this.logSuccess(`${runnerKey}: Executed custom command successfully with result\n`, logData);
        return (RunnerUtilsLogger.runnerUtilsLoggerInstance ||
            (RunnerUtilsLogger.runnerUtilsLoggerInstance = this));
    }
}
const runnerUtilsLogger = new RunnerUtilsLogger();
exports.default = runnerUtilsLogger;
//# sourceMappingURL=RunnerUtilsLogger.js.map