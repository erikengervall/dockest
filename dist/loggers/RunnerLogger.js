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
        this.setup = () => this.IS_NORMAL() && this.logLoading(`${RunnerLogger.runnerKey}Setup initiated`);
        this.setupSuccess = () => this.IS_NORMAL() && this.logSuccess(`${RunnerLogger.runnerKey}Setup successful`);
        this.startContainer = () => this.IS_NORMAL() && this.logLoading(`${RunnerLogger.runnerKey}Starting container`);
        this.startContainerSuccess = () => this.IS_NORMAL() && this.logSuccess(`${RunnerLogger.runnerKey}Container running`);
        this.checkHealth = () => this.IS_NORMAL() && this.logLoading(`${RunnerLogger.runnerKey}Healthchecking container`);
        this.checkHealthSuccess = () => this.IS_NORMAL() && this.logSuccess(`${RunnerLogger.runnerKey}Healthcheck successful`);
        this.checkResponsiveness = (timeout) => this.IS_VERBOSE() &&
            this.logLoading(`${RunnerLogger.runnerKey}Checking container's responsiveness (Timeout in: ${timeout}s)`);
        this.checkResponsivenessSuccess = () => this.IS_VERBOSE() &&
            this.logSuccess(`${RunnerLogger.runnerKey}Container's responsiveness checked`);
        this.checkConnection = (timeout) => this.IS_VERBOSE() &&
            this.logLoading(`${RunnerLogger.runnerKey}Checking container's connection (Timeout in: ${timeout}s)`);
        this.checkConnectionSuccess = () => this.IS_VERBOSE() && this.logSuccess(`${RunnerLogger.runnerKey}Container's connection checked`);
        /**
         * Teardown
         */
        this.teardown = () => this.IS_NORMAL() && this.logLoading(`${RunnerLogger.runnerKey}Container being teared down`);
        this.teardownSuccess = () => this.IS_NORMAL() && this.logSuccess(`${RunnerLogger.runnerKey}Container teared down`);
        this.stopContainer = () => this.IS_VERBOSE() && this.logLoading(`${RunnerLogger.runnerKey}Container being stopped`);
        this.stopContainerSuccess = () => this.IS_VERBOSE() && this.logSuccess(`${RunnerLogger.runnerKey}Container stopped`);
        this.removeContainer = () => this.IS_VERBOSE() && this.logLoading(`${RunnerLogger.runnerKey}Container being removed`);
        this.removeContainerSuccess = () => this.IS_VERBOSE() && this.logSuccess(`${RunnerLogger.runnerKey}Container removed`);
        /**
         * Misc
         */
        this.shellCmd = (logData = '') => this.IS_VERBOSE() && this.logInfo(`Executed following shell script`, this.trim(logData));
        return RunnerLogger.runnerLoggerInstance || (RunnerLogger.runnerLoggerInstance = this);
    }
}
RunnerLogger.setRunnerKey = (runnerKey) => {
    RunnerLogger.runnerKey = `${runnerKey}: `;
};
RunnerLogger.runnerKey = '';
exports.RunnerLogger = RunnerLogger;
const runnerLogger = new RunnerLogger();
exports.default = runnerLogger;
//# sourceMappingURL=RunnerLogger.js.map