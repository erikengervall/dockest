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
const acquireConnection = (host = 'localhost', port) => new Promise((resolve, reject) => {
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
    const { stdout: containerId } = await execa_1.default.shell(`docker ps --quiet --filter "name=${serviceName}" --no-trunc --latest`);
    return containerId;
};
exports.getContainerId = getContainerId;
const runCustomCommand = async (command) => {
    logger_1.default.loading(`Running custom command: ${command}`);
    const { stdout: result = '' } = await execa_1.default.shell(command);
    logger_1.default.success(`Successfully ran custom command: ${typeof result === 'object' ? JSON.stringify(result) : result}`);
};
exports.runCustomCommand = runCustomCommand;
