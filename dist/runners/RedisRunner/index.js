"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const index_1 = __importDefault(require("../../index"));
const utils_1 = require("../utils");
const execs_1 = __importDefault(require("./execs"));
const DEFAULT_CONFIG = {
    host: 'localhost',
    port: 6379,
    password: '',
    commands: [],
    connectionTimeout: 3,
    responsivenessTimeout: 10,
};
class RedisRunner {
    constructor(config) {
        this.containerId = '';
        this.runnerKey = '';
        this.setRunnerKey = (runnerKey) => {
            this.runnerKey = runnerKey;
        };
        this.setup = async (runnerKey) => {
            this.runnerKey = runnerKey;
            const containerId = await this.redisExec.start(this.config, runnerKey);
            this.containerId = containerId;
            await this.redisExec.checkHealth(this.config, containerId, runnerKey);
            const commands = this.config.commands || [];
            for (const cmd of commands) {
                await utils_1.runCustomCommand(runnerKey, cmd);
            }
        };
        this.teardown = async () => this.redisExec.teardown(this.containerId, this.runnerKey);
        this.validateConfig = () => {
            const schema = {
                service: utils_1.validateTypes.isString,
            };
            const failures = utils_1.validateTypes(schema, this.config);
            if (failures.length > 0) {
                throw new errors_1.ConfigurationError(`${failures.join('\n')}`);
            }
        };
        this.config = Object.assign({}, DEFAULT_CONFIG, config);
        this.redisExec = new execs_1.default();
        this.validateConfig();
    }
}
RedisRunner.getHelpers = () => {
    index_1.default.jestEnv = true;
    return {
        runHelpCmd: async (cmd) => utils_1.runCustomCommand(RedisRunner.name, cmd),
    };
};
exports.RedisRunner = RedisRunner;
exports.default = RedisRunner;
//# sourceMappingURL=index.js.map