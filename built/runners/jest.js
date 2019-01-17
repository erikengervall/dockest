"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DockestConfig_1 = __importDefault(require("../DockestConfig"));
const DockestLogger_1 = __importDefault(require("../DockestLogger"));
const jestRunner = async () => {
    const config = new DockestConfig_1.default().getConfig();
    const Logger = new DockestLogger_1.default();
    const jestOptions = config.jest;
    const jest = jestOptions.lib;
    let success = false;
    try {
        const jestResult = await jest.runCLI(jestOptions, jestOptions.projects);
        if (!jestResult.results.success) {
            Logger.failed(`${jestRunner.name}: Integration test failed`);
            success = false;
        }
        else {
            Logger.success(`${jestRunner.name}: Integration tests passed successfully`);
            success = true;
        }
    }
    catch (error) {
        Logger.error(`${jestRunner.name}: Encountered Jest error`, error);
        success = false;
    }
    return {
        success,
    };
};
exports.default = jestRunner;
