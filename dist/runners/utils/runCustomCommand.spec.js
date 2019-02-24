"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const loggers_1 = require("../../loggers");
const runCustomCommand_1 = __importDefault(require("./runCustomCommand"));
const runnerKey = 'mockRunnerKey';
const command = 'mockCommand';
const stdout = `mockStdout`;
jest.mock('execa', () => ({
    shell: jest.fn(() => ({
        stdout,
    })),
}));
jest.mock('../../loggers', () => ({
    runnerUtilsLogger: {
        customShellCmd: jest.fn(),
        customShellCmdSuccess: jest.fn(),
    },
}));
describe('runCustomCommand', () => {
    it('trabajo', async () => {
        await runCustomCommand_1.default(runnerKey, command);
        expect(loggers_1.runnerUtilsLogger.customShellCmd).toHaveBeenCalledWith(runnerKey, command);
        expect(execa_1.default.shell).toHaveBeenCalledWith(command);
        expect(execa_1.default.shell).lastReturnedWith({ stdout });
        expect(loggers_1.runnerUtilsLogger.customShellCmdSuccess).toHaveBeenCalledWith(runnerKey, stdout);
    });
});
//# sourceMappingURL=runCustomCommand.spec.js.map