"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const errors_1 = require("../errors");
const loggers_1 = require("../loggers");
const utils_1 = require("./utils");
const start = async (runnerConfig, execOpts) => {
    const { service } = runnerConfig;
    const { runnerKey, commandCreators } = execOpts;
    const startCommand = commandCreators.createStartCommand(runnerConfig);
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
exports.start = start;
const checkHealth = async (runnerConfig, execOpts) => {
    const { runnerKey } = execOpts;
    loggers_1.RunnerLogger.checkHealth(runnerKey);
    await checkConnection(runnerConfig, execOpts);
    await checkResponsiveness(runnerConfig, execOpts);
    loggers_1.RunnerLogger.checkHealthSuccess(runnerKey);
};
exports.checkHealth = checkHealth;
const teardown = async (execConfig) => {
    const { containerId, runnerKey } = execConfig;
    return utils_1.teardownSingle(containerId, runnerKey);
};
exports.teardown = teardown;
// TODO: no-any
const checkConnection = async (runnerConfig, execOpts) => {
    const { service, connectionTimeout, host, port } = runnerConfig;
    const { runnerKey } = execOpts;
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
// TODO: no-any
const checkResponsiveness = async (runnerConfig, execOpts) => {
    const { service, responsivenessTimeout } = runnerConfig;
    const { runnerKey, commandCreators: { createCheckResponsivenessCommand }, } = execOpts;
    if (!createCheckResponsivenessCommand) {
        return Promise.resolve();
    }
    const cmd = createCheckResponsivenessCommand(runnerConfig, execOpts);
    const recurse = async (responsivenessTimeout) => {
        loggers_1.RunnerLogger.checkResponsiveness(runnerKey, responsivenessTimeout);
        if (responsivenessTimeout <= 0) {
            throw new errors_1.DockestError(`${service} responsiveness timed out`);
        }
        try {
            loggers_1.RunnerLogger.shellCmd(cmd);
            await execa_1.default.shell(cmd);
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
//# sourceMappingURL=BaseExec.js.map