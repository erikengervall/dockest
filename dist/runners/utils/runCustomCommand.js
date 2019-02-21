"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const loggers_1 = require("../../loggers");
exports.default = async (runnerKey, command) => {
    loggers_1.runnerUtilsLogger.customShellCmd(runnerKey, command);
    const { stdout: result } = await execa_1.default.shell(command);
    loggers_1.runnerUtilsLogger.customShellCmdSuccess(runnerKey, result);
};
//# sourceMappingURL=runCustomCommand.js.map