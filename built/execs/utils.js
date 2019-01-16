"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const sleep = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));
exports.sleep = sleep;
const acquireConnection = (host = 'localhost', port) => new Promise((resolve, reject) => {
    let connected = false;
    let timeoutId = null;
    const netSocket = net_1.default
        .createConnection({ host, port })
        .on('connect', () => {
        clearTimeout(timeoutId);
        console.log('*** connected to server!'); // tslint:disable-line
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
