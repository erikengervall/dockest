"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const utils_1 = require("../utils");
const execs_1 = __importDefault(require("./execs"));
const DEFAULT_CONFIG = {
    host: 'localhost',
    ports: { '9092': '9092', '9093': '9093', '9094': '9094' },
    autoCreateTopics: true,
    commands: [],
    connectionTimeout: 30,
};
class KafkaRunner {
    constructor(config) {
        this.containerId = '';
        this.runnerKey = '';
        this.setup = async (runnerKey) => {
            this.runnerKey = runnerKey;
            const containerId = await this.kafkaExec.start(this.config, runnerKey);
            this.containerId = containerId;
            await this.kafkaExec.checkHealth(this.config, runnerKey);
        };
        this.teardown = async () => this.kafkaExec.teardown(this.containerId, this.runnerKey);
        this.validateConfig = () => {
            const schema = {
                service: utils_1.validateTypes.isString,
                zookeepeerConnect: utils_1.validateTypes.isString,
                topics: utils_1.validateTypes.isArrayOfType(utils_1.validateTypes.isString),
            };
            const failures = utils_1.validateTypes(schema, this.config);
            if (failures.length > 0) {
                throw new errors_1.ConfigurationError(`${failures.join('\n')}`);
            }
        };
        this.config = Object.assign({}, DEFAULT_CONFIG, config);
        this.kafkaExec = new execs_1.default();
        this.validateConfig();
    }
}
exports.KafkaRunner = KafkaRunner;
exports.default = KafkaRunner;
//# sourceMappingURL=index.js.map