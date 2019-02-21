"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../errors");
const loggers_1 = require("../../loggers");
const utils_1 = require("../utils");
exports.default = async (runnerConfig, execOpts) => {
    const { service, connectionTimeout, host, port } = runnerConfig;
    const { runnerKey } = execOpts;
    const recurse = async (connectionTimeout) => {
        loggers_1.runnerLogger.checkConnection(connectionTimeout);
        if (connectionTimeout <= 0) {
            throw new errors_1.DockestError(`${service} connection timed out`);
        }
        try {
            await utils_1.acquireConnection(port, host);
            loggers_1.runnerLogger.checkConnectionSuccess(runnerKey);
        }
        catch (error) {
            connectionTimeout--;
            await utils_1.sleep(1000);
            await recurse(connectionTimeout);
        }
    };
    await recurse(connectionTimeout);
};
//# sourceMappingURL=checkConnection.js.map