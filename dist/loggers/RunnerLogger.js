"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseLogger_1 = __importDefault(require("./BaseLogger"));
class RunnerLogger extends BaseLogger_1.default {
    constructor() {
        super();
        /**
         * Setup
         */
        this.setup = () => this.LOG_LEVEL_NORMAL && this.logLoading(`Setup initiated`);
        this.setupSuccess = () => this.LOG_LEVEL_NORMAL && this.logSuccess(`Setup successful`);
        this.startContainer = () => this.LOG_LEVEL_NORMAL && this.logLoading(`Starting container`);
        this.startContainerSuccess = () => this.LOG_LEVEL_NORMAL && this.logSuccess(`Container running`);
        this.checkHealth = () => this.LOG_LEVEL_NORMAL && this.logLoading(`Healthchecking container`);
        this.checkHealthSuccess = () => this.LOG_LEVEL_NORMAL && this.logSuccess(`Healthcheck successful`);
        this.checkResponsiveness = (timeout) => this.LOG_LEVEL_VERBOSE &&
            this.logLoading(`Checking container's responsiveness (Timeout in: ${timeout}s)`);
        this.checkResponsivenessSuccess = () => this.LOG_LEVEL_VERBOSE && this.logSuccess(`Container's responsiveness checked`);
        this.checkConnection = (timeout) => this.LOG_LEVEL_VERBOSE &&
            this.logLoading(`Checking container's connection (Timeout in: ${timeout}s)`);
        this.checkConnectionSuccess = () => this.LOG_LEVEL_VERBOSE && this.logSuccess(`Container's connection checked`);
        /**
         * Teardown
         */
        this.teardown = () => this.LOG_LEVEL_NORMAL && this.logLoading(`Container being teared down`);
        this.teardownSuccess = () => this.LOG_LEVEL_NORMAL && this.logSuccess(`Container teared down`);
        this.stopContainer = () => this.LOG_LEVEL_VERBOSE && this.logLoading(`Container being stopped`);
        this.stopContainerSuccess = () => this.LOG_LEVEL_VERBOSE && this.logSuccess(`Container stopped`);
        this.removeContainer = () => this.LOG_LEVEL_VERBOSE && this.logLoading(`Container being removed`);
        this.removeContainerSuccess = () => this.LOG_LEVEL_VERBOSE && this.logSuccess(`Container removed`);
        /**
         * Misc
         */
        this.shellCmd = (logData = '') => this.LOG_LEVEL_VERBOSE &&
            this.logLoading(`Executing following shell script`, this.trim(logData));
        this.shellCmdSuccess = (logData = '') => this.LOG_LEVEL_VERBOSE &&
            this.logSuccess(`Executed shell script with result`, this.trim(logData));
        return RunnerLogger.runnerLoggerInstance || (RunnerLogger.runnerLoggerInstance = this);
    }
}
exports.RunnerLogger = RunnerLogger;
const runnerLogger = new RunnerLogger();
exports.default = runnerLogger;
//# sourceMappingURL=RunnerLogger.js.map