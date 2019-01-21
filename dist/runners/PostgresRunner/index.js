"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const config_1 = require("../../utils/config");
const execs_1 = require("../../utils/execs");
const execs_2 = __importDefault(require("./execs"));
const DEFAULT_CONFIG = {
    commands: [],
};
class PostgresRunner {
    constructor(config) {
        this.setup = async (runnerKey) => {
            this.runnerKey = runnerKey;
            const containerId = await this.postgresExec.start(this.config);
            this.containerId = containerId;
            await this.postgresExec.checkHealth(containerId, this.config);
            const commands = this.config.commands || [];
            for (const cmd of commands) {
                await execs_1.runCustomCommand(cmd);
            }
        };
        this.teardown = async (runnerKey) => this.postgresExec.teardown(this.containerId, runnerKey);
        this.getHelpers = async () => ({
            clear: () => true,
            loadData: () => true,
        });
        this.validatePostgresConfig = (config) => {
            if (!config) {
                throw new errors_1.ConfigurationError('Missing configuration for Postgres runner');
            }
            const { service, host, database, port, password, username } = config;
            const requiredProps = { service, host, database, port, password, username };
            config_1.validateInputFields('postgres', requiredProps);
        };
        this.validatePostgresConfig(config);
        this.config = Object.assign({}, DEFAULT_CONFIG, config);
        this.postgresExec = new execs_2.default();
        this.containerId = '';
        this.runnerKey = '';
    }
}
exports.PostgresRunner = PostgresRunner;
exports.default = PostgresRunner;
//# sourceMappingURL=index.js.map