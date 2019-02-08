"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const net_1 = __importDefault(require("net"));
const logger_1 = __importDefault(require("./logger"));
const sleep = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));
exports.sleep = sleep;
const acquireConnection = (port, host = 'localhost') => new Promise((resolve, reject) => {
    let connected = false;
    let timeoutId = null;
    const netSocket = net_1.default
        .createConnection({ host, port })
        .on('connect', () => {
        clearTimeout(timeoutId);
        connected = true;
        netSocket.end();
        resolve();
    })
        .on('error', () => {
        connected = false;
    });
    timeoutId = setTimeout(() => !connected && reject(new Error('Timeout while acquiring connection')), 1000);
});
exports.acquireConnection = acquireConnection;
const getContainerId = async (serviceName) => {
    const cmd = `docker ps \
                --quiet \
                --filter \
                "name=${serviceName}" \
                --latest`;
    logger_1.default.command(cmd);
    const { stdout: containerId } = await execa_1.default.shell(cmd);
    return containerId;
};
exports.getContainerId = getContainerId;
const runCustomCommand = async (command) => {
    logger_1.default.loading(`Running command`, command);
    const { stdout: result } = await execa_1.default.shell(command);
    logger_1.default.success(`Command successful`, result);
};
exports.runCustomCommand = runCustomCommand;
//# sourceMappingURL=execs.js.map