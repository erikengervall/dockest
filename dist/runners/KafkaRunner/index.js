"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const BaseRunner_1 = __importDefault(require("../BaseRunner"));
const utils_1 = require("../utils");
const DEFAULT_CONFIG = {
    host: 'localhost',
    ports: { '9092': '9092', '9093': '9093', '9094': '9094' },
    autoCreateTopics: true,
    commands: [],
    connectionTimeout: 30,
};
const createStartCommand = (runnerConfig) => {
    const { ports, service, topics, autoCreateTopics, zookeepeerConnect } = runnerConfig;
    const portMapping = Object.keys(ports)
        .map(port => `--publish ${ports[port]}:${port}`)
        .join(' ');
    const env = ` -e KAFKA_ADVERTISED_HOST_NAME="localhost" \
              ${`-e KAFKA_AUTO_CREATE_TOPICS_ENABLE=${autoCreateTopics}`} \
              ${topics.length ? `-e KAFKA_CREATE_TOPICS="${topics.join(',')}"` : ''} \
              ${`-e KAFKA_ZOOKEEPER_CONNECT="${zookeepeerConnect}"`}`;
    const cmd = `docker-compose run \
              ${constants_1.defaultDockerComposeRunOpts} \
              ${portMapping} \
              ${env} \
              ${service}`;
    return cmd.replace(/\s+/g, ' ').trim();
};
class KafkaRunner extends BaseRunner_1.default {
    constructor(config) {
        const commandCreators = {
            createStartCommand,
        };
        const runnerConfig = Object.assign({}, DEFAULT_CONFIG, config);
        super(runnerConfig, commandCreators);
        const schema = {
            service: utils_1.validateTypes.isString,
            zookeepeerConnect: utils_1.validateTypes.isString,
            topics: utils_1.validateTypes.isArrayOfType(utils_1.validateTypes.isString),
        };
        this.validateConfig(schema, runnerConfig);
    }
}
exports.default = KafkaRunner;
//# sourceMappingURL=index.js.map