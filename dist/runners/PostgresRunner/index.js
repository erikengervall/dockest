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
    service: 'postgres',
    host: 'localhost',
    database: 'database',
    port: 5432,
    password: 'password',
    username: 'username',
    commands: [],
    connectionTimeout: 3,
    responsivenessTimeout: 10,
};
class PostgresRunner {
    constructor(config) {
        this.containerId = '';
        this.runnerKey = '';
        this.setRunnerKey = (runnerKey) => {
            this.runnerKey = runnerKey;
        };
        this.setup = async (runnerKey) => {
            this.runnerKey = runnerKey;
            const containerId = await this.postgresExec.start(this.config, runnerKey);
            this.containerId = containerId;
            await this.postgresExec.checkHealth(this.config, containerId, runnerKey);
            const commands = this.config.commands || [];
            for (const cmd of commands) {
                await utils_1.runCustomCommand(runnerKey, cmd);
            }
        };
        this.teardown = async () => this.postgresExec.teardown(this.containerId, this.runnerKey);
        this.validateConfig = () => {
            const schema = {
                service: utils_1.validateTypes.isString,
                host: utils_1.validateTypes.isString,
                database: utils_1.validateTypes.isString,
                port: utils_1.validateTypes.isNumber,
                password: utils_1.validateTypes.isString,
                username: utils_1.validateTypes.isString,
                commands: utils_1.validateTypes.isArrayOfType(utils_1.validateTypes.isString),
                connectionTimeout: utils_1.validateTypes.isNumber,
                responsivenessTimeout: utils_1.validateTypes.isNumber,
            };
            const failures = utils_1.validateTypes(schema, this.config);
            if (failures.length > 0) {
                throw new errors_1.ConfigurationError(`${failures.join('\n')}`);
            }
        };
        this.config = Object.assign({}, DEFAULT_CONFIG, config);
        this.postgresExec = new execs_1.default();
        this.validateConfig();
    }
}
PostgresRunner.getHelpers = () => {
    index_1.default.jestEnv = true;
    return {
        runHelpCmd: async (cmd) => utils_1.runCustomCommand(PostgresRunner.name, cmd),
    };
};
exports.PostgresRunner = PostgresRunner;
exports.default = PostgresRunner;
//# sourceMappingURL=index.js.map