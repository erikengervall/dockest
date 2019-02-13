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
class RedisExec {
    constructor() {
        this.start = async (runnerConfig, runnerKey) => {
            loggers_1.RunnerLogger.startContainer(runnerKey);
            const { port, service, password } = runnerConfig;
            let containerId = await utils_1.getContainerId(service);
            if (!containerId) {
                const portMapping = `--publish ${port}:6379`;
                const auth = password ? `--requirepass ${password}` : '';
                const cmd = `docker-compose run \
                    ${constants_1.defaultDockerComposeRunOpts} \
                    ${portMapping} \
                    ${service} \
                    ${auth}`;
                loggers_1.RunnerLogger.shellCmd(cmd);
                await execa_1.default.shell(cmd);
            }
            containerId = await utils_1.getContainerId(service);
            loggers_1.RunnerLogger.startContainerSuccess(runnerKey);
            return containerId;
        };
        this.checkHealth = async (runnerConfig, containerId, runnerKey) => {
            loggers_1.RunnerLogger.checkHealth(runnerKey);
            await this.checkResponsiveness(runnerConfig, containerId, runnerKey);
            await this.checkConnection(runnerConfig, runnerKey);
            loggers_1.RunnerLogger.checkHealthSuccess(runnerKey);
        };
        this.teardown = async (containerId, runnerKey) => utils_1.teardownSingle(containerId, runnerKey);
        this.checkResponsiveness = async (runnerConfig, containerId, runnerKey) => {
            const { responsivenessTimeout, host: runnerHost, password: runnerPassword } = runnerConfig;
            const recurse = async (responsivenessTimeout) => {
                loggers_1.RunnerLogger.checkResponsiveness(runnerKey, responsivenessTimeout);
                if (responsivenessTimeout <= 0) {
                    throw new errors_1.DockestError(`Redis responsiveness timed out`);
                }
                try {
                    const host = `-h ${runnerHost}`;
                    const port = `-p 6379`;
                    const password = runnerPassword ? `-a ${runnerPassword}` : '';
                    const command = `PING`;
                    const redisCliOpts = `${host} \
                              ${port} \
                              ${password} \
                              ${command}`;
                    const cmd = `docker exec ${containerId} redis-cli ${redisCliOpts}`;
                    loggers_1.RunnerLogger.shellCmd(cmd);
                    const { stdout: result } = await execa_1.default.shell(cmd);
                    if (result !== 'PONG') {
                        throw new Error('PING did not recieve a PONG');
                    }
                    loggers_1.RunnerLogger.checkResponsivenessSuccess(runnerKey);
                }
                catch (error) {
                    responsivenessTimeout--;
                    await utils_1.sleep(1000);
                    await recurse(responsivenessTimeout);
                }
            };
            await recurse(responsivenessTimeout);
        };
        this.checkConnection = async (runnerConfig, runnerKey) => {
            const { connectionTimeout, host, port } = runnerConfig;
            const recurse = async (connectionTimeout) => {
                loggers_1.RunnerLogger.checkConnection(runnerKey, connectionTimeout);
                if (connectionTimeout <= 0) {
                    throw new errors_1.DockestError(`Redis connection timed out`);
                }
                try {
                    await utils_1.acquireConnection(port, host);
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
        return RedisExec.instance || (RedisExec.instance = this);
    }
}
exports.default = RedisExec;
//# sourceMappingURL=execs.js.map