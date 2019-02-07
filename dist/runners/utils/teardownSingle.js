"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const loggers_1 = require("../../loggers");
const teardownSingle = async (containerId, runnerKey) => {
    if (!containerId) {
        loggers_1.GlobalLogger.error(`${runnerKey}: Cannot teardown container without a containerId`);
        return;
    }
    loggers_1.RunnerLogger.teardown(runnerKey);
    await stopContainerById(containerId, runnerKey);
    await removeContainerById(containerId, runnerKey);
    loggers_1.RunnerLogger.teardownSuccess(runnerKey);
};
const stopContainerById = async (containerId, runnerKey) => {
    loggers_1.RunnerLogger.stopContainer(runnerKey);
    try {
        const cmd = `docker stop ${containerId}`;
        loggers_1.RunnerLogger.shellCmd(cmd);
        await execa_1.default.shell(cmd);
    }
    catch (error) {
        loggers_1.GlobalLogger.error(`${runnerKey}: Failed to stop service container`, error);
        return;
    }
    loggers_1.RunnerLogger.stopContainerSuccess(runnerKey);
};
const removeContainerById = async (containerId, runnerKey) => {
    loggers_1.RunnerLogger.removeContainer(runnerKey);
    try {
        const cmd = `docker rm ${containerId} --volumes`;
        loggers_1.RunnerLogger.shellCmd(cmd);
        await execa_1.default.shell(cmd);
    }
    catch (error) {
        loggers_1.GlobalLogger.error(`${runnerKey}: Failed to remove service container`, error);
        return;
    }
    loggers_1.RunnerLogger.removeContainerSuccess(runnerKey);
};
exports.default = teardownSingle;
//# sourceMappingURL=teardownSingle.js.map