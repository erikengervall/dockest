"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const logger_1 = __importDefault(require("./utils/logger"));
const setupExitHandler = async (config) => {
    const { runners } = config;
    const exitHandler = async (errorPayload) => {
        if (index_1.default.jestRanWithResult) {
            // Expected exit, exit early
            return;
        }
        logger_1.default.error('Exithandler invoced', errorPayload);
        if (config.dockest && config.dockest.exitHandler && typeof exitHandler === 'function') {
            const err = errorPayload.error || new Error('Failed to extract error');
            config.dockest.exitHandler(err);
        }
        for (const runnerKey of Object.keys(runners)) {
            await runners[runnerKey].teardown(runnerKey);
        }
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
//# sourceMappingURL=exitHandler.js.map