"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const constants_1 = require("../../constants");
const errors_1 = require("../../errors");
const execs_1 = require("../../utils/execs");
const logger_1 = __importDefault(require("../../utils/logger"));
const teardown_1 = require("../../utils/teardown");
class PostgresExec {
    constructor() {
        this.start = async (runnerConfig, runnerKey) => {
            logger_1.default.startContainer(runnerKey);
            const { port, service, database, username, password } = runnerConfig;
            let containerId = await execs_1.getContainerId(service);
            if (!containerId) {
                const portMapping = `--publish ${port}:5432`;
                const env = `-e POSTGRES_DB=${database} \
                    -e POSTGRES_USER=${username} \
                    -e POSTGRES_PASSWORD=${password}`;
                const cmd = `docker-compose run \
                    ${constants_1.defaultDockerComposeRunOpts} \
                    ${portMapping} \
                    ${env} \
                    ${service}`;
                logger_1.default.command(cmd);
                await execa_1.default.shell(cmd);
            }
            containerId = await execs_1.getContainerId(service);
            logger_1.default.startContainerSuccess(runnerKey);
            return containerId;
        };
        this.checkHealth = async (runnerConfig, containerId, runnerKey) => {
            logger_1.default.checkHealth(runnerKey);
            await this.checkResponsiveness(runnerConfig, containerId, runnerKey);
            await this.checkConnection(runnerConfig, runnerKey);
            logger_1.default.checkHealthSuccess(runnerKey);
        };
        this.teardown = async (containerId, runnerKey) => teardown_1.teardownSingle(containerId, runnerKey);
        this.checkResponsiveness = async (runnerConfig, containerId, runnerKey) => {
            const { responsivenessTimeout = 10, host, database, username } = runnerConfig;
            const recurse = async (responsivenessTimeout) => {
                logger_1.default.checkResponsiveness(runnerKey, responsivenessTimeout);
                if (responsivenessTimeout <= 0) {
                    throw new errors_1.DockestError(`Database responsiveness timed out`);
                }
                try {
                    const cmd = `docker exec ${containerId} \
                      bash -c "psql \
                      -h ${host} \
                      -d ${database} \
                      -U ${username} \
                      -c 'select 1'"`;
                    logger_1.default.command(cmd);
                    await execa_1.default.shell(cmd);
                    logger_1.default.checkResponsivenessSuccess(runnerKey);
                }
                catch (error) {
                    responsivenessTimeout--;
                    await execs_1.sleep(1000);
                    await recurse(responsivenessTimeout);
                }
            };
            await recurse(responsivenessTimeout);
        };
        this.checkConnection = async (runnerConfig, runnerKey) => {
            const { connectionTimeout = 3, host, port } = runnerConfig;
            const recurse = async (connectionTimeout) => {
                logger_1.default.checkConnection(runnerKey, connectionTimeout);
                if (connectionTimeout <= 0) {
                    throw new errors_1.DockestError(`Database connection timed out`);
                }
                try {
                    await execs_1.acquireConnection(port, host);
                    logger_1.default.checkConnectionSuccess(runnerKey);
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