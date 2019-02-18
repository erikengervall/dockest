"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const index_1 = __importDefault(require("../../index"));
const BaseRunner_1 = __importDefault(require("../BaseRunner"));
const utils_1 = require("../utils");
const DEFAULT_CONFIG = {
    host: 'localhost',
    port: 6379,
    password: '',
    commands: [],
    connectionTimeout: 3,
    responsivenessTimeout: 10,
};
const createStartCommand = (runnerConfig) => {
    const { port, service, password } = runnerConfig;
    const portMapping = `--publish ${port}:6379`;
    const auth = !!password ? `--requirepass ${password}` : '';
    const cmd = `docker-compose run \
                ${constants_1.defaultDockerComposeRunOpts} \
                ${portMapping} \
                ${service} \
                ${auth}`;
    return cmd.replace(/\s+/g, ' ').trim();
};
const createCheckResponsivenessCommand = (runnerConfig, execOpts) => {
    const { host: runnerHost, password: runnerPassword } = runnerConfig;
    const { containerId } = execOpts;
    const host = `-h ${runnerHost}`;
    const port = `-p 6379`;
    const password = runnerPassword ? `-a ${runnerPassword}` : '';
    const command = `PING`;
    const redisCliOpts = `${host} \
                        ${port} \
                        ${password} \
                        ${command}`;
    const cmd = `docker exec ${containerId} redis-cli ${redisCliOpts}`;
    return cmd.replace(/\s+/g, ' ').trim();
};
class RedisRunner extends BaseRunner_1.default {
    constructor(config) {
        const commandCreators = {
            createStartCommand,
            createCheckResponsivenessCommand,
        };
        const runnerConfig = Object.assign({}, DEFAULT_CONFIG, config);
        super(runnerConfig, commandCreators);
        const schema = {
            service: utils_1.validateTypes.isString,
        };
        this.validateConfig(schema, runnerConfig);
    }
}
RedisRunner.getHelpers = () => {
    index_1.default.jestEnv = true;
    return {
        runHelpCmd: async (cmd) => utils_1.runCustomCommand(RedisRunner.name, cmd),
    };
};
exports.default = RedisRunner;
//# sourceMappingURL=index.js.map