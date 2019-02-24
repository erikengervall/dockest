"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const BaseRunner_1 = __importDefault(require("../BaseRunner"));
const utils_1 = require("../utils");
const DEFAULT_CONFIG = {
    port: 2181,
    commands: [],
    connectionTimeout: 30,
};
const createStartCommand = (runnerConfig) => {
    const { port, service } = runnerConfig;
    const portMapping = `--publish ${port}:2181`;
    const cmd = `docker-compose run \
                ${constants_1.defaultDockerComposeRunOpts} \
                ${portMapping} \
                ${service}`;
    return cmd.replace(/\s+/g, ' ').trim();
};
class ZookeeeperRunner extends BaseRunner_1.default {
    constructor(config) {
        const commandCreators = {
            createStartCommand,
        };
        const runnerConfig = Object.assign({}, DEFAULT_CONFIG, config);
        super(runnerConfig, commandCreators);
        const schema = {
            service: utils_1.validateTypes.isString,
        };
        this.validateConfig(schema, runnerConfig);
    }
}
exports.default = ZookeeeperRunner;
//# sourceMappingURL=index.js.map