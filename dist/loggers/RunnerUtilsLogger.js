"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseLogger_1 = __importDefault(require("./BaseLogger"));
class RunnerUtilsLogger extends BaseLogger_1.default {
    constructor() {
        super();
        this.customShellCmd = (runnerKey, cmd) => this.LOG_LEVEL_NORMAL && this.logLoading(`${runnerKey}: Executed custom command`, cmd);
        this.customShellCmdSuccess = (runnerKey, logData) => this.LOG_LEVEL_NORMAL &&
            this.logSuccess(`${runnerKey}: Executed custom command successfully with result\n`, logData);
        this.shellCmd = (logData = '') => this.LOG_LEVEL_VERBOSE &&
            this.logLoading(`Executing following shell script`, this.trim(logData));
        this.shellCmdSuccess = (logData = '') => this.LOG_LEVEL_VERBOSE &&
            this.logSuccess(`Executed shell script with result`, this.trim(logData));
        return (RunnerUtilsLogger.runnerUtilsLoggerInstance ||
            (RunnerUtilsLogger.runnerUtilsLoggerInstance = this));
    }
}
const runnerUtilsLogger = new RunnerUtilsLogger();
exports.default = runnerUtilsLogger;
//# sourceMappingURL=RunnerUtilsLogger.js.map