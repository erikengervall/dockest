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
    port: 5432,
    commands: [],
    connectionTimeout: 3,
    responsivenessTimeout: 10,
};
const createStartCommand = (runnerConfig) => {
    const { port, service, database, username, password } = runnerConfig;
    const portMapping = ` \ 
                --publish ${port}:5432 \
                `;
    const env = ` \
                -e POSTGRES_DB=${database} \
                -e POSTGRES_USER=${username} \
                -e POSTGRES_PASSWORD=${password} \
              `;
    const cmd = ` \
                docker-compose run \
                ${constants_1.defaultDockerComposeRunOpts} \
                ${portMapping} \
                ${env} \
                ${service} \
              `;
    return cmd.replace(/\s+/g, ' ').trim();
};
const createCheckResponsivenessCommand = (runnerConfig, execOpts) => {
    const { host, database, username } = runnerConfig;
    const { containerId } = execOpts;
    const cmd = ` \
                docker exec ${containerId} \
                bash -c "psql \
                -h ${host} \
                -d ${database} \
                -U ${username} \
                -c 'select 1'"
              `;
    return cmd.replace(/\s+/g, ' ').trim();
};
class PostgresRunner extends BaseRunner_1.default {
    constructor(configUserInput) {
        const commandCreators = {
            createStartCommand,
            createCheckResponsivenessCommand,
        };
        const runnerConfig = Object.assign({}, DEFAULT_CONFIG, configUserInput);
        super(runnerConfig, commandCreators);
        const schema = {
            service: utils_1.validateTypes.isString,
            database: utils_1.validateTypes.isString,
            password: utils_1.validateTypes.isString,
            username: utils_1.validateTypes.isString,
        };
        this.validateConfig(schema, runnerConfig);
    }
}
PostgresRunner.getHelpers = () => {
    index_1.default.jestEnv = true;
    return {
        runHelpCmd: async (cmd) => utils_1.runCustomCommand(PostgresRunner.name, cmd),
    };
};
exports.default = PostgresRunner;
//# sourceMappingURL=index.js.map