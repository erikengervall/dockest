"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const config_1 = require("../../utils/config");
const execs_1 = __importDefault(require("./execs"));
const DEFAULT_CONFIG = {
    topics: [],
    autoCreateTopics: true,
};
class KafkaRunner {
    constructor(config) {
        this.setup = async (runnerKey) => {
            this.runnerKey = runnerKey;
            const containerId = await this.kafkaExec.start(this.config, runnerKey);
            this.containerId = containerId;
            await this.kafkaExec.checkHealth(this.config, runnerKey);
        };
        this.teardown = async (runnerKey) => this.kafkaExec.teardown(this.containerId, runnerKey);
        this.getHelpers = async () => ({
            clear: () => true,
            loadData: () => true,
        });
        this.validateKafkaConfig = (config) => {
            if (!config) {
                throw new errors_1.ConfigurationError('Missing configuration for Kafka runner');
            }
            const { service, host, ports, topics, zookeepeerConnect, autoCreateTopics } = config;
            const requiredProps = { service, host, ports, topics, zookeepeerConnect, autoCreateTopics };
            if (!ports['9093']) {
                throw new errors_1.ConfigurationError('Missing required port-mapping for Kafka runner');
            }
            config_1.validateInputFields('kafka', requiredProps);
        };
        this.config = Object.assign({}, DEFAULT_CONFIG, config);
        this.validateKafkaConfig(config);
        this.kafkaExec = new execs_1.default();
        this.containerId = '';
        this.runnerKey = '';
    }
}
exports.KafkaRunner = KafkaRunner;
exports.default = KafkaRunner;
//# sourceMappingURL=index.js.map