"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const net_1 = __importDefault(require("net"));
const logger_1 = __importDefault(require("../../logger"));
const logger = new logger_1.default();
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
const runCustomCommand = async (command) => {
    logger.loading(`Running custom command: ${command}`);
    const { stdout: result = '' } = await execa_1.default.shell(command);
    logger.success(`Successfully ran custom command: ${typeof result === 'object' ? JSON.stringify(result) : result}`);
};
exports.runCustomCommand = runCustomCommand;
// Deprecated
const getContainerId = async (runnerConfig) => {
    const { label } = runnerConfig;
    const { stdout } = await execa_1.default.shell(`docker ps --filter "status=running" --filter "label=${label}" --no-trunc -q`);
    const containerId = stdout.replace(/\r?\n|\r/g, '');
    return containerId;
};
exports.getContainerId = getContainerId;
