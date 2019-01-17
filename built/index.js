"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DockestConfig_1 = __importDefault(require("./DockestConfig"));
const DockestLogger_1 = __importDefault(require("./DockestLogger"));
const teardown_1 = __importDefault(require("./execs/utils/teardown"));
const exitHandler_1 = __importDefault(require("./exitHandler"));
const runners_1 = __importDefault(require("./runners"));
const postgres_1 = __importDefault(require("./runners/postgres"));
const dockest = async (userConfig) => {
    new DockestConfig_1.default(userConfig); // tslint:disable-line
    const logger = new DockestLogger_1.default();
    const teardown = new teardown_1.default();
    exitHandler_1.default();
    try {
        await runners_1.default();
    }
    catch (error) {
        logger.error('Unexpected error', error);
        await teardown.tearAll();
        process.exit(1);
    }
};
exports.runners = {
    PostgresRunner: postgres_1.default,
};
exports.default = dockest;
