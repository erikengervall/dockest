"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const errors_1 = require("./errors");
const exitHandler_1 = __importDefault(require("./exitHandler"));
const jest_1 = __importDefault(require("./jest"));
const runners_1 = require("./runners");
const utils_1 = require("./runners/utils");
const DEFAULT_CONFIG = {
    logLevel: constants_1.LOG_LEVEL.NORMAL,
    exitHandler: (_) => undefined,
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
            await utils_1.runCustomCommand('Dockest', 'docker-compose pull');
            for (const runnerKey of Object.keys(runners)) {
                await runners[runnerKey].setup(runnerKey);
            }
        };
        this.runJest = async () => {
            const result = await this.jestRunner.run();
            Dockest.jestRanWithResult = true;
            return result;
        };
        this.teardownRunners = async () => {
            const { runners } = Dockest.config;
            for (const runnerKey of Object.keys(runners)) {
                await runners[runnerKey].teardown();
            }
        };
        this.validateConfig = () => {
            const schema = {
                jest: utils_1.validateTypes.isObject,
                runners: utils_1.validateTypes.isObject,
            };
            const failures = utils_1.validateTypes(schema, Dockest.config);
            if (failures.length > 0) {
                throw new errors_1.ConfigurationError(`${failures.join('\n')}`);
            }
        };
        Dockest.config = Object.assign({}, DEFAULT_CONFIG, userConfig);
        this.jestRunner = new jest_1.default(Dockest.config.jest);
        this.validateConfig();
        exitHandler_1.default(Dockest.config);
        return Dockest.instance || (Dockest.instance = this);
    }
}
Dockest.jestRanWithResult = false;
/**
 * jestEnv
 * Dockest has been imported from a non-global node env (e.g. jest's node vm)
 * This means that the Dockest singleton is unretrievable
 * This variable is primarily used to default the logLevel to normal
 */
Dockest.jestEnv = false;
exports.default = Dockest;
const logLevel = constants_1.LOG_LEVEL;
exports.logLevel = logLevel;
const runners = { KafkaRunner: runners_1.KafkaRunner, PostgresRunner: runners_1.PostgresRunner, RedisRunner: runners_1.RedisRunner, ZookeeperRunner: runners_1.ZookeeperRunner };
exports.runners = runners;
//# sourceMappingURL=index.js.map