"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const logger_1 = __importDefault(require("./logger"));
const DEFAULT_CONFIG = {
    projects: ['.'],
};
class JestRunner {
    constructor(config) {
        this.run = async () => {
            const jestOptions = JestRunner.config;
            const jest = JestRunner.config.lib;
            let success = false;
            logger_1.default.success(`Dependencies up and running, running Jest`);
            try {
                const jestResult = await jest.runCLI(jestOptions, jestOptions.projects);
                if (!jestResult.results.success) {
                    logger_1.default.failed(`Jest test(s) failed`);
                    success = false;
                }
                else {
                    logger_1.default.success(`Jest run successfully`);
                    success = true;
                }
            }
            catch (error) {
                logger_1.default.error(`Encountered Jest error`, error);
                success = false;
            }
            return {
                success,
            };
        };
        this.validateJestConfig = (config) => {
            if (!config) {
                throw new errors_1.ConfigurationError('Jest config missing');
            }
            const MINIMUM_JEST_VERSION = '20.0.0'; // Released 2017-05-06: https://github.com/facebook/jest/releases/tag/v20.0.0
            if (config.lib.getVersion() < MINIMUM_JEST_VERSION) {
                throw new errors_1.ConfigurationError('Jest version not supported');
            }
        };
        if (JestRunner.instance) {
            return JestRunner.instance;
        }
        this.validateJestConfig(config);
        JestRunner.config = Object.assign({}, DEFAULT_CONFIG, config);
        JestRunner.instance = this;
    }
}
exports.default = JestRunner;
//# sourceMappingURL=jest.js.map