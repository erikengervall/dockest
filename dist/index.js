"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const errors_1 = require("./errors");
const exitHandler_1 = __importDefault(require("./exitHandler"));
const jest_1 = __importDefault(require("./jest"));
const loggers_1 = require("./loggers");
const runners_1 = require("./runners");
const utils_1 = require("./runners/utils");
const DEFAULT_CONFIG_DOCKEST = {
    logLevel: constants_1.LOG_LEVEL.NORMAL,
    exitHandler: () => undefined,
};
class Dockest {
    constructor(userConfig) {
        this.run = async () => {
            await this.setupRunners();
            const result = await this.runJest();
            await this.teardownRunners();
            result.success ? process.exit(0) : process.exit(1);
        };
        this.setupRunners = async () => {
            const { runners } = Dockest.config;
            for (const runnerKey of Object.keys(runners)) {
                loggers_1.RunnerLogger.setup(runnerKey);
                await runners[runnerKey].setup(runnerKey);
                loggers_1.RunnerLogger.setupSuccess(runnerKey);
            }
        };
        this.runJest = async () => {
            const result = await Dockest.jestRunner.run();
            Dockest.jestRanWithResult = true;
            return result;
        };
        this.teardownRunners = async () => {
            const { runners } = Dockest.config;
            for (const runnerKey of Object.keys(runners)) {
                await runners[runnerKey].teardown(runnerKey);
            }
        };
        this.validateConfig = () => {
            const schema = {
                logLevel: utils_1.validateTypes.isOneOf(Object.values(constants_1.LOG_LEVEL)),
            };
            const failures = utils_1.validateTypes(schema, Dockest.config.dockest);
            if (failures.length > 0) {
                throw new errors_1.ConfigurationError(`${failures.join('\n')}`);
            }
        };
        Dockest.config = Object.assign({}, userConfig, { dockest: Object.assign({}, DEFAULT_CONFIG_DOCKEST, userConfig.dockest) });
        Dockest.jestRunner = new jest_1.default(Dockest.config.jest);
        this.validateConfig();
        exitHandler_1.default(Dockest.config);
        return Dockest.instance || (Dockest.instance = this);
    }
}
Dockest.jestRanWithResult = false;
exports.runners = { KafkaRunner: runners_1.KafkaRunner, PostgresRunner: runners_1.PostgresRunner, ZookeeperRunner: runners_1.ZookeeperRunner };
exports.logLevel = constants_1.LOG_LEVEL;
exports.default = Dockest;
//# sourceMappingURL=index.js.map