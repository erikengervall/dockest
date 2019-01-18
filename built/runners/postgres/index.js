"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const index_1 = __importDefault(require("../../index"));
const execUtils_1 = require("../../utils/execUtils");
const runnerUtils_1 = require("../../utils/runnerUtils");
const execs_1 = __importDefault(require("./execs"));
class PostgresRunner {
    constructor(config) {
        this.setup = async () => {
            const composeFile = index_1.default.config.dockest.dockerComposeFilePath;
            const containerId = await this.postgresExec.start(this.config, composeFile);
            this.containerId = containerId;
            await this.postgresExec.checkHealth(containerId, this.config);
            const commands = this.config.commands || [];
            for (const cmd of commands) {
                await execUtils_1.runCustomCommand(cmd);
            }
        };
        this.teardown = async () => this.postgresExec.teardown(this.containerId);
        this.getHelpers = async () => ({
            clear: () => true,
            loadData: () => true,
        });
        this.validatePostgresConfig = (config) => {
            if (!config) {
                throw new errors_1.ConfigurationError('Missing configuration for Postgres runner');
            }
            const { service, host, db, port, password, username } = config;
            const requiredProps = { service, host, db, port, password, username };
            runnerUtils_1.validateInputFields('postgres', requiredProps);
        };
        this.validatePostgresConfig(config);
        this.config = config;
        this.postgresExec = new execs_1.default();
    }
}
exports.PostgresRunner = PostgresRunner;
exports.default = PostgresRunner;
