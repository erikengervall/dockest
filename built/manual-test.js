"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const acquireConnection = () => new Promise((resolve, reject) => {
    let connected = false;
    let timeoutId = null;
    const netSocket = net_1.default
        .createConnection({ port: 5433 })
        .on('connect', () => {
        clearTimeout(timeoutId);
        console.log('*** connected to server!'); // tslint:disable-line
        connected = true;
        netSocket.end();
        resolve();
    })
        .on('error', e => {
        connected = false;
    });
    timeoutId = setTimeout(() => !connected && reject(new Error('Timeout while acquiring connection')), 1000);
});
// Deprecated
const checkPostgresConnection = async ({ connectionTimeout: timeout = 3 }) => {
    console.log('Attempting to establish database connection'); // tslint:disable-line
    const recurse = async (timeout) => {
        console.log(`Establishing database connection (Timing out in: ${timeout}s)`); // tslint:disable-line
        if (timeout <= 0) {
            throw new Error('Database connection timed out');
        }
        try {
            await acquireConnection();
            console.log('Database connection established'); // tslint:disable-line
        }
        catch (error) {
            console.log('*************error', error); // tslint:disable-line
            timeout--;
            await recurse(timeout);
        }
    };
    await recurse(timeout);
};
checkPostgresConnection({ connectionTimeout: 3 });
