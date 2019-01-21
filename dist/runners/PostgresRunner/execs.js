"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const errors_1 = require("../../errors");
const execs_1 = require("../../utils/execs");
const logger_1 = __importDefault(require("../../utils/logger"));
const teardown_1 = require("../../utils/teardown");
class PostgresExec {
    constructor() {
        this.start = async (runnerConfig) => {
            logger_1.default.loading('Starting postgres container');
            const { port, service } = runnerConfig;
            let containerId = '';
            containerId = await execs_1.getContainerId(service);
            if (!containerId) {
                await execa_1.default.shell(`docker-compose run --detach --no-deps --publish ${port}:5432 ${service}`);
            }
            containerId = await execs_1.getContainerId(service);
            logger_1.default.success(`Postgres container started successfully`);
            return containerId;
        };
        this.checkHealth = async (containerId, runnerConfig) => {
            await this.checkResponsiveness(containerId, runnerConfig);
            await this.checkConnection(runnerConfig);
        };
        this.teardown = async (containerId, runnerKey) => teardown_1.teardownSingle(containerId, runnerKey);
        this.checkResponsiveness = async (containerId, runnerConfig) => {
            logger_1.default.loading('Attempting to establish database responsiveness');
            const { responsivenessTimeout = 10, host, username, database } = runnerConfig;
            const recurse = async (responsivenessTimeout) => {
                logger_1.default.loading(`Establishing database responsiveness (Timing out in: ${responsivenessTimeout}s)`);
                if (responsivenessTimeout <= 0) {
                    throw new errors_1.DockestError(`Database responsiveness timed out`);
                }
                try {
                    await execa_1.default.shell(`docker exec ${containerId} bash -c "psql -h ${host} -U ${username} -d ${database} -c 'select 1'"`);
                    logger_1.default.success('Database responsiveness established');
                }
                catch (error) {
                    responsivenessTimeout--;
                    await execs_1.sleep(1000);
                    await recurse(responsivenessTimeout);
                }
            };
            await recurse(responsivenessTimeout);
        };
        this.checkConnection = async (runnerConfig) => {
            return; // causes issues with travis
            logger_1.default.loading('Attempting to establish database connection');
            const { connectionTimeout = 3, host, port } = runnerConfig;
            const recurse = async (connectionTimeout) => {
                logger_1.default.loading(`Establishing database connection (Timing out in: ${connectionTimeout}s)`);
                if (connectionTimeout <= 0) {
                    throw new errors_1.DockestError(`Database connection timed out`);
                }
                try {
                    await execs_1.acquireConnection(host, port);
                    logger_1.default.success('Database connection established');
                }
                catch (error) {
                    connectionTimeout--;
                    await execs_1.sleep(1000);
                    await recurse(connectionTimeout);
                }
            };
            await recurse(connectionTimeout);
        };
        if (PostgresExec.instance) {
            return PostgresExec.instance;
        }
        PostgresExec.instance = this;
    }
}
exports.default = PostgresExec;
//# sourceMappingURL=execs.js.map