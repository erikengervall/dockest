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
class KafkaRunner {
    constructor(config) {
        this.setup = async (runnerKey) => {
            this.runnerKey = runnerKey;
            const containerId = await this.kafkaExec.start(this.config);
            this.containerId = containerId;
            await this.kafkaExec.checkHealth(this.config);
            const commands = this.config.commands || [];
            for (const cmd of commands) {
                await execs_1.runCustomCommand(cmd);
            }
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
            const { service, host, ports } = config;
            const requiredProps = { service, host, ports };
            if (!ports['9093']) {
                throw new errors_1.ConfigurationError('Missing required port-mapping for Kafka runner');
            }
            config_1.validateInputFields('kafka', requiredProps);
        };
        this.validateKafkaConfig(config);
        this.config = Object.assign({}, DEFAULT_CONFIG, config);
        this.kafkaExec = new execs_2.default();
        this.containerId = '';
        this.runnerKey = '';
    }
}
exports.KafkaRunner = KafkaRunner;
exports.default = KafkaRunner;
//# sourceMappingURL=index.js.map