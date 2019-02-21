"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const loggers_1 = require("../../loggers");
const index_1 = require("./index");
exports.default = async (runnerConfig, execOpts) => {
    const { service } = runnerConfig;
    const { runnerKey, commandCreators } = execOpts;
    const startCommand = commandCreators.createStartCommand(runnerConfig);
    loggers_1.runnerLogger.startContainer(runnerKey);
    let containerId = await index_1.getContainerId(service);
    if (!containerId) {
        loggers_1.runnerLogger.shellCmd(startCommand);
        await execa_1.default.shell(startCommand);
    }
    containerId = await index_1.getContainerId(service);
    loggers_1.runnerLogger.startContainerSuccess(runnerKey);
    return containerId;
};
//# sourceMappingURL=execStart.js.map