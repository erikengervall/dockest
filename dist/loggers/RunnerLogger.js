"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseLogger_1 = __importDefault(require("./BaseLogger"));
class ExecLogger extends BaseLogger_1.default {
    constructor() {
        super();
        /**
         * Setup
         */
        this.setup = runnerKey => this.IS_NORMAL() && this.logLoading(`${runnerKey}: Setup initiated`);
        this.setupSuccess = runnerKey => this.IS_NORMAL() && this.logSuccess(`${runnerKey}: Setup successful`);
        this.startContainer = runnerKey => this.IS_NORMAL() && this.logLoading(`${runnerKey}: Starting container`);
        this.startContainerSuccess = runnerKey => this.IS_NORMAL() && this.logSuccess(`${runnerKey}: Container running`);
        this.checkHealth = runnerKey => this.IS_NORMAL() && this.logLoading(`${runnerKey}: Healthchecking container`);
        this.checkHealthSuccess = runnerKey => this.IS_NORMAL() && this.logSuccess(`${runnerKey}: Healthcheck successful`);
        this.checkResponsiveness = (runnerKey, timeout) => this.IS_VERBOSE() &&
            this.logLoading(`${runnerKey}: Checking container's responsiveness (Timeout in: ${timeout}s)`);
        this.checkResponsivenessSuccess = runnerKey => this.IS_VERBOSE() && this.logSuccess(`${runnerKey}: Container's responsiveness checked`);
        this.checkConnection = (runnerKey, timeout) => this.IS_VERBOSE() &&
            this.logLoading(`${runnerKey}: Checking container's connection (Timeout in: ${timeout}s)`);
        this.checkConnectionSuccess = runnerKey => this.IS_VERBOSE() && this.logSuccess(`${runnerKey}: Container's connection checked`);
        /**
         * Teardown
         */
        this.teardown = runnerKey => this.IS_NORMAL() && this.logLoading(`${runnerKey}: Container being teared down`);
        this.teardownSuccess = runnerKey => this.IS_NORMAL() && this.logSuccess(`${runnerKey}: Container teared down`);
        this.stopContainer = runnerKey => this.IS_VERBOSE() && this.logLoading(`${runnerKey}: Container being stopped`);
        this.stopContainerSuccess = runnerKey => this.IS_VERBOSE() && this.logSuccess(`${runnerKey}: Container stopped`);
        this.removeContainer = runnerKey => this.IS_VERBOSE() && this.logLoading(`${runnerKey}: Container being removed`);
        this.removeContainerSuccess = runnerKey => this.IS_VERBOSE() && this.logSuccess(`${runnerKey}: Container removed`);
        /**
         * Misc
         */
        this.shellCmd = (logData = '') => this.IS_VERBOSE() && this.logInfo(`Executed following shell script`, this.trim(logData));
        return ExecLogger.execLoggerInstance || (ExecLogger.execLoggerInstance = this);
    }
}
const execLogger = new ExecLogger();
exports.default = execLogger;
//# sourceMappingURL=RunnerLogger.js.map