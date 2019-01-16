"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const DockestLogger_1 = __importDefault(require("../DockestLogger"));
// import { IPostgresRunnerConfig } from '../runners/postgres'
const logger = new DockestLogger_1.default();
// Deprecated
// const getContainerId = async (runnerConfig: IPostgresRunnerConfig): Promise<string> => {
//   const { label } = runnerConfig
//   const { stdout } = await execa.shell(
//     `docker ps --filter "status=running" --filter "label=${label}" --no-trunc -q`
//   )
//   const containerId = stdout.replace(/\r?\n|\r/g, '')
//   return containerId
// }
const runCustomCommand = async (command) => {
    logger.loading(`Running custom command: ${command}`);
    const { stdout: result = '' } = await execa_1.default.shell(command);
    logger.success(`Successfully ran custom command: ${typeof result === 'object' ? JSON.stringify(result) : result}`);
};
exports.runCustomCommand = runCustomCommand;
