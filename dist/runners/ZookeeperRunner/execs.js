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
class ZookeeperExec {
    constructor() {
        this.start = async (runnerConfig) => {
            logger_1.default.loading('Starting zookeeper container');
            const { port, service } = runnerConfig;
            let containerId = await execs_1.getContainerId(service);
            if (!containerId) {
                await execa_1.default.shell(`docker-compose run --detach --publish ${port}:2181 ${service}`);
                // const a = `docker-compose run --publish 8081:9082 --publish 9092:9092 --publish 9093:9093 --publish 9094:9094  -e kafka_hostname="" -e KAFKA_ADVERTISED_HOST_NAME="localhost" -e kafka_auto_create_topics_enable=true -e kafka_create_topics="Topic1:1:3,Topic2:1:1:compact" -e kafka_zookeeper_connect="zookeeper:2181" kafka`
            }
            containerId = await execs_1.getContainerId(service);
            logger_1.default.success(`Zookeeper container started successfully`);
            return containerId;
        };
        this.checkHealth = async (runnerConfig) => {
            await this.checkConnection(runnerConfig);
        };
        this.teardown = async (containerId, runnerKey) => teardown_1.teardownSingle(containerId, runnerKey);
        this.checkConnection = async (runnerConfig) => {
            logger_1.default.loading('Attempting to establish zookeeper connection');
            const { connectionTimeout = 30, port } = runnerConfig;
            const recurse = async (connectionTimeout) => {
                logger_1.default.loading(`Establishing zookeeper connection (Timing out in: ${connectionTimeout}s)`);
                if (connectionTimeout <= 0) {
                    throw new errors_1.DockestError('Zookeeper connection timed out');
                }
                try {
                    await execs_1.acquireConnection(port);
                    logger_1.default.success('Zookeeper connection established');
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