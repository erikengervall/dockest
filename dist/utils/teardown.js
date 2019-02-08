"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const logger_1 = __importDefault(require("./logger"));
const teardownSingle = async (containerId, runnerKey) => {
    if (!containerId) {
        logger_1.default.error(`${runnerKey}: Missing containerId for runner`);
        return;
    }
    await stopContainerById(containerId, runnerKey);
    await removeContainerById(containerId, runnerKey);
};
exports.teardownSingle = teardownSingle;
const stopContainerById = async (containerId, runnerKey) => {
    logger_1.default.stopContainer(runnerKey);
    try {
        const cmd = `docker stop ${containerId}`;
        logger_1.default.command(cmd);
        await execa_1.default.shell(cmd);
    }
    catch (error) {
        logger_1.default.error(`${runnerKey}: Failed to stop service container`, error);
        return;
    }
    logger_1.default.stopContainerSuccess(runnerKey);
};
const removeContainerById = async (containerId, runnerKey) => {
    try {
        const cmd = `docker rm ${containerId} --volumes`;
        logger_1.default.command(cmd);
        await execa_1.default.shell(cmd);
    }
    catch (error) {
        logger_1.default.error(`${runnerKey}: Failed to remove service container`, error);
        return;
    }
    logger_1.default.removeContainerSuccess(runnerKey);
};
//# sourceMappingURL=teardown.js.map