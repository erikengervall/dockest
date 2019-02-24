"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loggers_1 = require("../../loggers");
const index_1 = require("./index");
const stopContainerById = async (containerId, runnerKey) => {
    loggers_1.runnerLogger.stopContainer(runnerKey);
    try {
        const cmd = `docker stop ${containerId}`;
        await index_1.execa(cmd);
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
        await index_1.execa(cmd);
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