"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const utils_1 = require("../utils");
const execs_1 = __importDefault(require("./execs"));
const DEFAULT_CONFIG = {
    commands: [],
};
class PostgresRunner {
    constructor(config) {
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
        this.teardown = async (runnerKey) => this.postgresExec.teardown(this.containerId, runnerKey);
        this.validateConfig = () => {
            const schema = {
                service: utils_1.validateTypes.isString,
                host: utils_1.validateTypes.isString,
                database: utils_1.validateTypes.isString,
                port: utils_1.validateTypes.isNumber,
                password: utils_1.validateTypes.isString,
                username: utils_1.validateTypes.isString,
            };
            const failures = utils_1.validateTypes(schema, this.config);
            if (failures.length > 0) {
                throw new errors_1.ConfigurationError(`${failures.join('\n')}`);
            }
        };
        this.config = Object.assign({}, DEFAULT_CONFIG, config);
        this.postgresExec = new execs_1.default();
        this.containerId = '';
        this.runnerKey = '';
        this.validateConfig();
    }
}
exports.PostgresRunner = PostgresRunner;
exports.default = PostgresRunner;
//# sourceMappingURL=index.js.map