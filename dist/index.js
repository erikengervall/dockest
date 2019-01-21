"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exitHandler_1 = __importDefault(require("./exitHandler"));
const runners_1 = require("./runners");
const config_1 = require("./utils/config");
const jest_1 = __importDefault(require("./utils/jest"));
const logger_1 = __importDefault(require("./utils/logger"));
const DEFAULT_CONFIG_DOCKEST = {
    verbose: false,
    exitHandler: () => undefined,
};
class Dockest {
    constructor(userConfig) {
        this.run = async () => {
            logger_1.default.loading('Integration test initiated');
            const { jest, runners } = this.config;
            exitHandler_1.default(this.config);
            await this.setupRunners(runners);
            const result = await this.runJest(jest);
            await this.teardownRunners(runners);
            result.success ? process.exit(0) : process.exit(1);
        };
        this.setupRunners = async (runners) => {
            for (const runnerKey of Object.keys(runners)) {
                await runners[runnerKey].setup(runnerKey);
            }
        };
        this.runJest = async (jest) => {
            const jestRunner = new jest_1.default(jest);
            const result = await jestRunner.run();
            Dockest.jestRanWithResult = true;
            return result;
        };
        this.teardownRunners = async (runners) => {
            for (const runnerKey of Object.keys(runners)) {
                await runners[runnerKey].teardown(runnerKey);
            }
        };
        const { dockest, jest } = userConfig;
        const requiredProps = { dockest, jest, runners: exports.runners };
        config_1.validateInputFields('Dockest', requiredProps);
        this.config = Object.assign({}, userConfig, { dockest: Object.assign({}, DEFAULT_CONFIG_DOCKEST, userConfig.dockest) });
    }
}
Dockest.jestRanWithResult = false;
exports.runners = { PostgresRunner: runners_1.PostgresRunner };
exports.default = Dockest;
//# sourceMappingURL=index.js.map