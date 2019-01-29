"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const config_1 = require("../../utils/config");
const execs_1 = __importDefault(require("./execs"));
const DEFAULT_CONFIG = {};
class ZookeeeperRunner {
    constructor(config) {
        this.setup = async (runnerKey) => {
            this.runnerKey = runnerKey;
            const containerId = await this.ZookeeperExec.start(this.config, runnerKey);
            this.containerId = containerId;
            await this.ZookeeperExec.checkHealth(this.config, runnerKey);
        };
        this.teardown = async (runnerKey) => this.ZookeeperExec.teardown(this.containerId, runnerKey);
        this.getHelpers = async () => ({
            clear: () => true,
            loadData: () => true,
        });
        this.validateZookeeperConfig = (config) => {
            if (!config) {
                throw new errors_1.ConfigurationError('Missing configuration for Zookeeper runner');
            }
            const { service, port } = config;
            const requiredProps = { service, port };
            config_1.validateInputFields('zookeeper', requiredProps);
        };
        this.validateZookeeperConfig(config);
        this.config = Object.assign({}, DEFAULT_CONFIG, config);
        this.ZookeeperExec = new execs_1.default();
        this.containerId = '';
        this.runnerKey = '';
    }
}
exports.ZookeeeperRunner = ZookeeeperRunner;
exports.default = ZookeeeperRunner;
//# sourceMappingURL=index.js.map