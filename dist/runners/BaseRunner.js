"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const loggers_1 = require("../loggers");
const execs_1 = require("./execs");
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
            loggers_1.BaseLogger.runnerKey = `${runnerKey}: `;
            this.execOpts.runnerKey = runnerKey;
            loggers_1.runnerLogger.setup(this.execOpts.runnerKey);
            const containerId = await execs_1.start(this.runnerConfig, this.execOpts);
            this.execOpts.containerId = containerId;
            await execs_1.checkResponsiveness(this.runnerConfig, this.execOpts);
            await execs_1.checkConnection(this.runnerConfig, this.execOpts);
            const commands = this.runnerConfig.commands || [];
            for (const cmd of commands) {
                await utils_1.runCustomCommand(this.execOpts.runnerKey, cmd);
            }
            loggers_1.runnerLogger.setupSuccess(this.execOpts.runnerKey);
        };
        this.teardown = () => execs_1.teardown(this.execOpts);
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