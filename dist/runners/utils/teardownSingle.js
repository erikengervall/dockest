"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const loggers_1 = require("../../loggers");
const stopContainerById = async (containerId, runnerKey) => {
    loggers_1.runnerLogger.stopContainer(runnerKey);
    try {
        const cmd = `docker stop ${containerId}`;
        loggers_1.runnerLogger.shellCmd(cmd);
        await execa_1.default.shell(cmd);
    }
    catch (error) {
        loggers_1.globalLogger.error(`${runnerKey}: Failed to stop service container`, error);
        return;
    }
    loggers_1.runnerLogger.stopContainerSuccess(runnerKey);
};
const removeContainerById = async (containerId, runnerKey) => {
    loggers_1.runnerLogger.removeContainer(runnerKey);
    try {
        const cmd = `docker rm ${containerId} --volumes`;
        loggers_1.runnerLogger.shellCmd(cmd);
        await execa_1.default.shell(cmd);
    }
    catch (error) {
        loggers_1.globalLogger.error(`${runnerKey}: Failed to remove service container`, error);
        return;
    }
    loggers_1.runnerLogger.removeContainerSuccess(runnerKey);
};
exports.default = async (containerId, runnerKey) => {
    if (!containerId) {
        loggers_1.globalLogger.error(`${runnerKey}: Cannot teardown container without a containerId`);
        return;
    }
    loggers_1.runnerLogger.teardown(runnerKey);
    await stopContainerById(containerId, runnerKey);
    await removeContainerById(containerId, runnerKey);
    loggers_1.runnerLogger.teardownSuccess(runnerKey);
};
//# sourceMappingURL=teardownSingle.js.map