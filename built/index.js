"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exit_1 = __importDefault(require("exit"));
const DockestConfig_1 = __importDefault(require("./DockestConfig"));
const DockestLogger_1 = __importDefault(require("./DockestLogger"));
const teardown_1 = require("./execs/teardown");
const exitHandler_1 = __importDefault(require("./exitHandler"));
const runners_1 = __importDefault(require("./runners"));
const postgres_1 = __importDefault(require("./runners/postgres"));
const dockest = async (userConfig) => {
    new DockestConfig_1.default(userConfig); // tslint:disable-line
    const Logger = new DockestLogger_1.default();
    try {
        exitHandler_1.default();
        await runners_1.default();
    }
    catch (error) {
        Logger.error('Unexpected error', error);
        await teardown_1.tearAll();
        exit_1.default(1);
    }
};
exports.runners = {
    PostgresRunner: postgres_1.default,
};
exports.default = dockest;
