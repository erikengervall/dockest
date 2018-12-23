"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exit_1 = __importDefault(require("exit"));
const setupExitHandler = async (resources) => {
    const { Config, Logger, Execs } = resources;
    const { teardown: { tearAll }, } = Execs;
    const exitHandler = async (errorPayload) => {
        Logger.info('Exithandler invoced', errorPayload);
        const config = Config.getConfig();
        if (config.dockest && config.dockest.exitHandler && typeof exitHandler === 'function') {
            config.dockest.exitHandler();
        }
        await tearAll();
        Logger.info('Exit with payload');
        exit_1.default(errorPayload.code || 1);
    };
    // so the program will not close instantly
    process.stdin.resume();
    // do something when app is closing
    process.on('exit', async (code) => exitHandler({ code }));
    // catches ctrl+c event
    process.on('SIGINT', async (signal) => exitHandler({ signal }));
    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', async () => exitHandler({}));
    process.on('SIGUSR2', async () => exitHandler({}));
    // catches uncaught exceptions
    process.on('uncaughtException', async (error) => exitHandler({ error }));
    // catches unhandled promise rejections
    process.on('unhandledRejection', async (reason, p) => exitHandler({ reason, p }));
};
exports.default = setupExitHandler;
