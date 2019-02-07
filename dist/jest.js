"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const loggers_1 = require("./loggers");
const DEFAULT_CONFIG = {
    projects: ['.'],
};
class JestRunner {
    constructor(config) {
        this.run = async () => {
            const jestOptions = JestRunner.config;
            const jest = JestRunner.config.lib;
            let success = false;
            loggers_1.JestLogger.success(`Dependencies up and running, running Jest`);
            try {
                const jestResult = await jest.runCLI(jestOptions, jestOptions.projects);
                if (!jestResult.results.success) {
                    loggers_1.JestLogger.failed(`Jest test(s) failed`);
                    success = false;
                }
                else {
                    loggers_1.JestLogger.success(`Jest test(s) successful`);
                    success = true;
                }
            }
            catch (error) {
                loggers_1.JestLogger.error(`Failed to run Jest`, error);
                success = false;
            }
            return {
                success,
            };
        };
        this.validateJestConfig = () => {
            const config = JestRunner.config;
            // Validate jest
            if (!config) {
                throw new errors_1.ConfigurationError('jest');
            }
            // Validate jest.lib
            if (!config.lib) {
                throw new errors_1.ConfigurationError('jest.lib');
            }
            // Validate jest version
            const MINIMUM_JEST_VERSION = '20.0.0'; // Released 2017-05-06: https://github.com/facebook/jest/releases/tag/v20.0.0
            if (config.lib.getVersion() < MINIMUM_JEST_VERSION) {
                throw new errors_1.ConfigurationError('Jest version not supported');
            }
        };
        if (JestRunner.instance) {
            return JestRunner.instance;
        }
        JestRunner.config = Object.assign({}, DEFAULT_CONFIG, config);
        this.validateJestConfig();
        JestRunner.instance = this;
    }
}
exports.default = JestRunner;
//# sourceMappingURL=jest.js.map