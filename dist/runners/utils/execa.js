"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const loggers_1 = require("../../loggers");
exports.default = async (cmd) => {
    loggers_1.runnerUtilsLogger.shellCmd(cmd);
    const { stdout: result } = await execa_1.default.shell(cmd);
    loggers_1.runnerUtilsLogger.shellCmdSuccess(result);
    return result;
};
//# sourceMappingURL=execa.js.map