"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const createHelpers = (Logger) => {
    const getContainerId = async (postgresConfig) => {
        const { stdout } = await execa_1.default.shell(`docker ps --filter "status=running" --filter "label=${postgresConfig.label}" --no-trunc -q`);
        const containerId = stdout.replace(/\r?\n|\r/g, '');
        return containerId;
    };
    const customCmd = async (cmd) => {
        Logger.loading(`Running custom command: ${cmd}`);
        const { stdout } = await execa_1.default.shell(cmd);
        Logger.success(`Successfully ran custom command with result:`, {
            result: stdout,
        });
        return stdout;
    };
    return {
        getContainerId,
        customCmd,
    };
};
exports.default = createHelpers;
