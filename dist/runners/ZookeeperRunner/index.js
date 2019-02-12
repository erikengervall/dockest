"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const utils_1 = require("../utils");
const execs_1 = __importDefault(require("./execs"));
const DEFAULT_CONFIG = {
    service: 'zookeeper',
    port: 2181,
    connectionTimeout: 30,
};
class ZookeeeperRunner {
    constructor(config) {
        this.containerId = '';
        this.runnerKey = '';
        this.setup = async (runnerKey) => {
            this.runnerKey = runnerKey;
            const containerId = await this.ZookeeperExec.start(this.config, runnerKey);
            this.containerId = containerId;
            await this.ZookeeperExec.checkHealth(this.config, runnerKey);
        };
        this.teardown = async () => this.ZookeeperExec.teardown(this.containerId, this.runnerKey);
        this.validateInput = () => {
            const schema = {
                service: utils_1.validateTypes.isString,
                port: utils_1.validateTypes.isNumber,
                connectionTimeout: utils_1.validateTypes.isNumber,
            };
            const failures = utils_1.validateTypes(schema, this.config);
            if (failures.length > 0) {
                throw new errors_1.ConfigurationError(`${failures.join('\n')}`);
            }
        };
        this.config = Object.assign({}, DEFAULT_CONFIG, config);
        this.ZookeeperExec = new execs_1.default();
        this.validateInput();
    }
}
exports.ZookeeeperRunner = ZookeeeperRunner;
exports.default = ZookeeeperRunner;
//# sourceMappingURL=index.js.map