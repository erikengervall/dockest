"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const jest = require('jest') // tslint:disable-line
const exit_1 = __importDefault(require("exit"));
const jestRunner = async (resources) => {
    const { Config, Logger, Execs } = resources;
    const { teardown: { tearAll }, } = Execs;
    const jestOptions = Config.getConfig().jest;
    const jest = jestOptions.lib;
    try {
        const jestResult = await jest.runCLI(jestOptions, jestOptions.projects);
        if (!jestResult.results.success) {
            Logger.failed('Integration test failed');
            await tearAll();
            exit_1.default(1);
        }
        else {
            Logger.success('Integration tests passed successfully');
            await tearAll();
            exit_1.default(0);
        }
    }
    catch (error) {
        Logger.error('Encountered Jest error', error);
        exit_1.default(1);
    }
};
exports.default = jestRunner;
