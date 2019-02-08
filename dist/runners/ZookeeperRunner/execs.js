"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const constants_1 = require("../../constants");
const errors_1 = require("../../errors");
const loggers_1 = require("../../loggers");
const utils_1 = require("../utils");
class ZookeeperExec {
    constructor() {
        this.start = async (runnerConfig, runnerKey) => {
            loggers_1.RunnerLogger.startContainer(runnerKey);
            const { port, service } = runnerConfig;
            let containerId = await utils_1.getContainerId(service);
            if (!containerId) {
                const portMapping = `--publish ${port}:2181`;
                const cmd = `docker-compose run \
                    ${constants_1.defaultDockerComposeRunOpts} \
                    ${portMapping} \
                    ${service}`;
                loggers_1.RunnerLogger.shellCmd(cmd);
                await execa_1.default.shell(cmd);
            }
            containerId = await utils_1.getContainerId(service);
            loggers_1.RunnerLogger.startContainerSuccess(service);
            return containerId;
        };
        this.checkHealth = async (runnerConfig, runnerKey) => {
            loggers_1.RunnerLogger.checkHealth(runnerKey);
            await this.checkConnection(runnerConfig, runnerKey);
            loggers_1.RunnerLogger.checkHealthSuccess(runnerKey);
        };
        this.teardown = async (containerId, runnerKey) => utils_1.teardownSingle(containerId, runnerKey);
        this.checkConnection = async (runnerConfig, runnerKey) => {
            const { connectionTimeout = 30, port } = runnerConfig;
            const recurse = async (connectionTimeout) => {
                loggers_1.RunnerLogger.checkConnection(runnerKey, connectionTimeout);
                if (connectionTimeout <= 0) {
                    throw new errors_1.DockestError('Zookeeper connection timed out');
                }
                try {
                    await utils_1.acquireConnection(port);
                    loggers_1.RunnerLogger.checkConnectionSuccess(runnerKey);
                }
                catch (error) {
                    connectionTimeout--;
                    await utils_1.sleep(1000);
                    await recurse(connectionTimeout);
                }
            };
            await recurse(connectionTimeout);
        };
        return ZookeeperExec.instance || (ZookeeperExec.instance = this);
    }
}
exports.default = ZookeeperExec;
//# sourceMappingURL=execs.js.map