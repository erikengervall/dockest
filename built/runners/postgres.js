"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigurationError_1 = __importDefault(require("../errors/ConfigurationError"));
const postgresExecs_1 = __importDefault(require("../execs/postgresExecs"));
const index_1 = __importDefault(require("../index"));
const utils_1 = require("../utils");
class PostgresRunner {
    constructor(config) {
        this.setup = async () => {
            const composeFile = index_1.default.config.dockest.dockerComposeFilePath;
            const containerId = await this.postgresExec.start(this.config, composeFile);
            this.containerId = containerId;
            await this.postgresExec.checkConnection(this.config);
            await this.postgresExec.checkResponsiveness(containerId, this.config);
        };
        this.teardown = async () => this.postgresExec.teardown(this.containerId);
        this.getHelpers = async () => ({
            clear: () => true,
            loadData: () => true,
        });
        this.validatePostgresConfig = (config) => {
            const { label, service, host, db, port, password, username } = config;
            const requiredProps = { label, service, host, db, port, password, username };
            utils_1.validateInputFields('postgres', requiredProps);
            if (!config) {
                throw new ConfigurationError_1.default('Missing configuration for Postgres runner');
            }
        };
        this.validatePostgresConfig(config);
        this.config = config;
        this.postgresExec = new postgresExecs_1.default();
    }
}
exports.PostgresRunner = PostgresRunner;
exports.default = PostgresRunner;
