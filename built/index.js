"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exit_1 = __importDefault(require("exit"));
const DockestConfig_1 = __importDefault(require("./DockestConfig"));
const DockestLogger_1 = __importDefault(require("./DockestLogger"));
const execs_1 = __importDefault(require("./execs"));
const exitHandler_1 = __importDefault(require("./exitHandler"));
const runners_1 = __importDefault(require("./runners"));
const dockest = async (userConfig) => {
    const Config = new DockestConfig_1.default(userConfig);
    const Logger = new DockestLogger_1.default(Config);
    const Execs = new execs_1.default(Config, Logger);
    const resources = { Config, Logger, Execs };
    try {
        exitHandler_1.default(resources);
        const runners = runners_1.default(resources);
        await runners.all();
    }
    catch (error) {
        Logger.error('Unexpected error', error);
        await Execs.teardown.tearAll();
        exit_1.default(1);
    }
};
exports.default = dockest;
