"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DockestLogger_1 = __importDefault(require("./DockestLogger"));
const teardown_1 = __importDefault(require("./execs/utils/teardown"));
const index_1 = __importDefault(require("./index"));
const setupExitHandler = async () => {
    const config = index_1.default.config;
    const logger = new DockestLogger_1.default();
    const exitHandler = async (errorPayload) => {
        logger.info('Exithandler invoced', errorPayload);
        if (config.dockest && config.dockest.exitHandler && typeof exitHandler === 'function') {
            const err = errorPayload.error || new Error('Failed to extract error');
            config.dockest.exitHandler(err);
        }
        const teardown = new teardown_1.default();
        await teardown.tearAll();
        logger.info('Exit with payload');
        process.exit(errorPayload.code || 1);
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
