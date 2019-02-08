"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const loggers_1 = require("../../loggers");
const runCustomCommand = async (runnerKey, command) => {
    loggers_1.RunnerUtilsLogger.customShellCmd(runnerKey, command);
    const { stdout: result } = await execa_1.default.shell(command);
    loggers_1.RunnerUtilsLogger.customShellCmdSuccess(runnerKey, result);
};
exports.default = runCustomCommand;
//# sourceMappingURL=runCustomCommand.js.map