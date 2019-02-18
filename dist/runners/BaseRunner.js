"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const loggers_1 = require("../loggers");
const BaseExec_1 = __importDefault(require("./BaseExec"));
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
            const containerId = await this.exec.start(this.runnerConfig, this.execOpts);
            this.execOpts.containerId = containerId;
            await this.exec.checkHealth(this.runnerConfig, this.execOpts);
            const commands = this.runnerConfig.commands || [];
            for (const cmd of commands) {
                await utils_1.runCustomCommand(this.execOpts.runnerKey, cmd);
            }
            loggers_1.RunnerLogger.setupSuccess(this.execOpts.runnerKey);
        };
        this.teardown = async () => {
            return this.exec.teardown(this.execOpts);
        };
        this.runnerConfig = runnerConfig;
        this.execOpts = {
            commandCreators,
            containerId: '',
            runnerKey: '',
        };
        this.exec = new BaseExec_1.default();
    }
}
exports.default = BaseRunner;
//# sourceMappingURL=BaseRunner.js.map