"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const loggers_1 = require("../../loggers");
exports.default = async (serviceName) => {
    const cmd = `docker ps \
                  --quiet \
                  --filter \
                  "name=${serviceName}" \
                  --latest`;
    loggers_1.RunnerLogger.shellCmd(cmd);
    const { stdout: containerId } = await execa_1.default.shell(cmd);
    return containerId;
};
//# sourceMappingURL=getContainerId.js.map