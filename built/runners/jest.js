"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DockestLogger_1 = __importDefault(require("../DockestLogger"));
const ConfigurationError_1 = __importDefault(require("../errors/ConfigurationError"));
class JestRunner {
    constructor(config) {
        this.run = async () => {
            const logger = new DockestLogger_1.default();
            const jestOptions = JestRunner.config;
            const jest = JestRunner.config.lib;
            let success = false;
            logger.success(`Dependencies up and running, running Jest`);
            try {
                const jestResult = await jest.runCLI(jestOptions, jestOptions.projects);
                if (!jestResult.results.success) {
                    logger.failed(`Integration test failed`);
                    success = false;
                }
                else {
                    logger.success(`Integration tests passed successfully`);
                    success = true;
                }
            }
            catch (error) {
                logger.error(`Encountered Jest error`, error);
                success = false;
            }
            return {
                success,
            };
        };
        this.validateJestConfig = (config) => {
            if (!config) {
                throw new ConfigurationError_1.default('jest config missing');
            }
        };
        if (JestRunner.instance) {
            return JestRunner.instance;
        }
        this.validateJestConfig(config);
        JestRunner.config = config;
    }
}
exports.default = JestRunner;
