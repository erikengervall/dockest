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
class ZookeeperExec {
    constructor() {
        this.start = async (runnerConfig, runnerKey) => {
            logger_1.default.startContainer(runnerKey);
            const { port, service } = runnerConfig;
            let containerId = await execs_1.getContainerId(service);
            if (!containerId) {
                const portMapping = `--publish ${port}:2181`;
                const cmd = `docker-compose run \
                    ${constants_1.defaultDockerComposeRunOpts} \
                    ${portMapping} \
                    ${service}`;
                logger_1.default.command(cmd);
                await execa_1.default.shell(cmd);
            }
            containerId = await execs_1.getContainerId(service);
            logger_1.default.startContainerSuccess(service);
            return containerId;
        };
        this.checkHealth = async (runnerConfig, runnerKey) => {
            logger_1.default.checkHealth(runnerKey);
            await this.checkConnection(runnerConfig, runnerKey);
            logger_1.default.checkHealthSuccess(runnerKey);
        };
        this.teardown = async (containerId, runnerKey) => teardown_1.teardownSingle(containerId, runnerKey);
        this.checkConnection = async (runnerConfig, runnerKey) => {
            const { connectionTimeout = 30, port } = runnerConfig;
            const recurse = async (connectionTimeout) => {
                logger_1.default.checkConnection(runnerKey, connectionTimeout);
                if (connectionTimeout <= 0) {
                    throw new errors_1.DockestError('Zookeeper connection timed out');
                }
                try {
                    await execs_1.acquireConnection(port);
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
        if (ZookeeperExec.instance) {
            return ZookeeperExec.instance;
        }
        ZookeeperExec.instance = this;
    }
}
exports.default = ZookeeperExec;
//# sourceMappingURL=execs.js.map