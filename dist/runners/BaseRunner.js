"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const loggers_1 = require("../loggers");
const BaseExec_1 = require("./BaseExec");
const utils_1 = require("./utils");
class BaseRunner {
    constructor(runnerConfig, commandCreators) {
        this.validateConfig = (schema, config) => {
            const failures = utils_1.validateTypes(schema, config);
            if (failures.length > 0) {
                throw new errors_1.ConfigurationError(`${failures.join('\n')}`);
            }
        };
        this.setup = async (runnerKey) => {
            this.execOpts.runnerKey = runnerKey;
            loggers_1.RunnerLogger.setup(this.execOpts.runnerKey);
            const containerId = await BaseExec_1.start(this.runnerConfig, this.execOpts);
            this.execOpts.containerId = containerId;
            await BaseExec_1.checkHealth(this.runnerConfig, this.execOpts);
            const commands = this.runnerConfig.commands || [];
            for (const cmd of commands) {
                await utils_1.runCustomCommand(this.execOpts.runnerKey, cmd);
            }
            loggers_1.RunnerLogger.setupSuccess(this.execOpts.runnerKey);
        };
        this.teardown = async () => {
            return BaseExec_1.teardown(this.execOpts);
        };
        this.runnerConfig = runnerConfig;
        this.execOpts = {
            commandCreators,
            containerId: '',
            runnerKey: '',
        };
    }
}
exports.default = BaseRunner;
//# sourceMappingURL=BaseRunner.js.map