"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loggers_1 = require("../../loggers");
const utils_1 = require("../utils");
exports.default = async (runnerConfig, execOpts) => {
    const { service } = runnerConfig;
    const { runnerKey, commandCreators } = execOpts;
    const startCommand = commandCreators.createStartCommand(runnerConfig);
    loggers_1.runnerLogger.startContainer(runnerKey);
    let containerId = await utils_1.getContainerId(service);
    if (!containerId) {
        await utils_1.execa(startCommand);
    }
    containerId = await utils_1.getContainerId(service);
    loggers_1.runnerLogger.startContainerSuccess(runnerKey);
    return containerId;
};
//# sourceMappingURL=start.js.map