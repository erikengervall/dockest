"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exit_1 = __importDefault(require("exit"));
const DockestConfig_1 = __importDefault(require("../DockestConfig"));
const DockestLogger_1 = __importDefault(require("../DockestLogger"));
const teardown_1 = require("../execs/teardown");
const jestRunner = async () => {
    const config = new DockestConfig_1.default().getConfig();
    const Logger = new DockestLogger_1.default();
    const jestOptions = config.jest;
    const jest = jestOptions.lib;
    try {
        const jestResult = await jest.runCLI(jestOptions, jestOptions.projects);
        if (!jestResult.results.success) {
            Logger.failed('Integration test failed');
            await teardown_1.tearAll();
            exit_1.default(1);
        }
        else {
            Logger.success('Integration tests passed successfully');
            await teardown_1.tearAll();
            exit_1.default(0);
        }
    }
    catch (error) {
        Logger.error('Encountered Jest error', error);
        exit_1.default(1);
    }
};
exports.default = jestRunner;
