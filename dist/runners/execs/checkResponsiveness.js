"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const errors_1 = require("../../errors");
const loggers_1 = require("../../loggers");
const utils_1 = require("../utils");
exports.default = async (runnerConfig, execOpts) => {
    const { service, responsivenessTimeout } = runnerConfig;
    const { runnerKey, commandCreators: { createCheckResponsivenessCommand }, } = execOpts;
    if (!createCheckResponsivenessCommand) {
        return Promise.resolve();
    }
    const cmd = createCheckResponsivenessCommand(runnerConfig, execOpts);
    const recurse = async (responsivenessTimeout) => {
        loggers_1.runnerLogger.checkResponsiveness(responsivenessTimeout);
        if (responsivenessTimeout <= 0) {
            throw new errors_1.DockestError(`${service} responsiveness timed out`);
        }
        try {
            loggers_1.runnerLogger.shellCmd(cmd);
            await execa_1.default.shell(cmd);
            loggers_1.runnerLogger.checkResponsivenessSuccess(runnerKey);
        }
        catch (error) {
            responsivenessTimeout--;
            await utils_1.sleep(1000);
            await recurse(responsivenessTimeout);
        }
    };
    await recurse(responsivenessTimeout);
};
//# sourceMappingURL=checkResponsiveness.js.map