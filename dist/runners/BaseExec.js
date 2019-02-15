"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const errors_1 = require("../errors");
const loggers_1 = require("../loggers");
const utils_1 = require("./utils");
class BaseExec {
    constructor() {
        this.start = async (runnerConfig, execOpts) => {
            const { service } = runnerConfig;
            const { runnerKey, commandCreators } = execOpts;
            const startCommand = commandCreators.start(runnerConfig);
            loggers_1.RunnerLogger.startContainer(runnerKey);
            let containerId = await utils_1.getContainerId(service);
            if (!containerId) {
                loggers_1.RunnerLogger.shellCmd(startCommand);
                await execa_1.default.shell(startCommand);
            }
            containerId = await utils_1.getContainerId(service);
            loggers_1.RunnerLogger.startContainerSuccess(runnerKey);
            return containerId;
        };
        this.checkHealth = async (runnerConfig, execOpts) => {
            // @ts-ignore TODO: This needs to be addressed
            const { checkResponsiveness } = runnerConfig;
            const { runnerKey } = execOpts;
            loggers_1.RunnerLogger.checkHealth(runnerKey);
            await this.checkConnection(runnerConfig);
            if (checkResponsiveness) {
                await this.checkResponsiveness(runnerConfig);
            }
            loggers_1.RunnerLogger.checkHealthSuccess(runnerKey);
        };
        this.teardown = async (execConfig) => {
            const { containerId, runnerKey } = execConfig;
            return utils_1.teardownSingle(containerId, runnerKey);
        };
        this.checkConnection = async (runnerConfig) => {
            const { runnerKey, service, connectionTimeout, host, port } = runnerConfig;
            const recurse = async (connectionTimeout) => {
                loggers_1.RunnerLogger.checkConnection(runnerKey, connectionTimeout);
                if (connectionTimeout <= 0) {
                    throw new errors_1.DockestError(`${service} connection timed out`);
                }
                try {
                    await utils_1.acquireConnection(port, host);
                    loggers_1.RunnerLogger.checkConnectionSuccess(runnerKey);
                }
                catch (error) {
                    connectionTimeout--;
                    await utils_1.sleep(1000);
                    await recurse(connectionTimeout);
                }
            };
            await recurse(connectionTimeout);
        };
        this.checkResponsiveness = async (runnerConfig) => {
            const { runnerKey, service, responsivenessTimeout, commands: { checkResponsiveness }, } = runnerConfig;
            const recurse = async (responsivenessTimeout) => {
                loggers_1.RunnerLogger.checkResponsiveness(runnerKey, responsivenessTimeout);
                if (responsivenessTimeout <= 0) {
                    throw new errors_1.DockestError(`${service} responsiveness timed out`);
                }
                try {
                    loggers_1.RunnerLogger.shellCmd(checkResponsiveness(runnerConfig));
                    await execa_1.default.shell(checkResponsiveness(runnerConfig));
                    loggers_1.RunnerLogger.checkResponsivenessSuccess(runnerKey);
                }
                catch (error) {
                    responsivenessTimeout--;
                    await utils_1.sleep(1000);
                    await recurse(responsivenessTimeout);
                }
            };
            await recurse(responsivenessTimeout);
        };
    }
}
exports.default = BaseExec;
//# sourceMappingURL=BaseExec.js.map