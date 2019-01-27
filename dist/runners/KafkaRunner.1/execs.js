"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
// import fs from 'fs'
const errors_1 = require("../../errors");
const execs_1 = require("../../utils/execs");
const logger_1 = __importDefault(require("../../utils/logger"));
const teardown_1 = require("../../utils/teardown");
const PRIMARY_KAFKA_PORT = '9092';
class KafkaExec {
    constructor() {
        this.start = async (runnerConfig) => {
            logger_1.default.loading('Starting kafka container');
            const { ports, service, topics, autoCreateTopics } = runnerConfig;
            let containerId = '';
            containerId = await execs_1.getContainerId(service);
            if (!containerId) {
                const stringifiedPorts = Object.keys(ports)
                    .map(port => `--publish ${ports[port]}:${port}`)
                    .join(' ');
                const env = ` -e kafka_hostname="" \
                    -e kafka_advertised_hostname="localhost" \
                    -e kafka_auto_create_topics_enable=${autoCreateTopics} \
                    ${(topics.length && `-e kafka_create_topics="${topics.join(',')}"`) || ''}`;
                await execa_1.default.shell(`docker-compose run --detach ${stringifiedPorts} ${env} ${service}`);
            }
            containerId = await execs_1.getContainerId(service);
            logger_1.default.success(`Kafka container started successfully`);
            return containerId;
        };
        this.checkHealth = async (runnerConfig) => {
            await this.checkConnection(runnerConfig);
        };
        this.teardown = async (containerId, runnerKey) => teardown_1.teardownSingle(containerId, runnerKey);
        this.checkConnection = async (runnerConfig) => {
            logger_1.default.loading('Attempting to establish Kafka connection');
            const { connectionTimeout = 30, ports } = runnerConfig;
            const primaryKafkaPort = Number(Object.keys(ports).find(port => ports[port] === PRIMARY_KAFKA_PORT));
            const recurse = async (connectionTimeout) => {
                logger_1.default.loading(`Establishing Kafka connection (Timing out in: ${connectionTimeout}s)`);
                if (connectionTimeout <= 0) {
                    throw new errors_1.DockestError('Kafka connection timed out');
                }
                try {
                    await execs_1.acquireConnection(primaryKafkaPort);
                    logger_1.default.success('Kafka connection established');
                }
                catch (error) {
                    connectionTimeout--;
                    await execs_1.sleep(1000);
                    await recurse(connectionTimeout);
                }
            };
            await recurse(connectionTimeout);
        };
        if (KafkaExec.instance) {
            return KafkaExec.instance;
        }
        KafkaExec.instance = this;
    }
}
exports.default = KafkaExec;
//# sourceMappingURL=execs.js.map