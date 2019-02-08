"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const loggers_1 = require("../../loggers");
const teardownSingle_1 = __importDefault(require("./teardownSingle"));
const runnerKey = 'mockRunnerKey';
const containerId = 'mockContainerId';
const stdout = `mockStdout`;
jest.mock('execa', () => ({
    shell: jest.fn(() => ({
        stdout,
    })),
}));
jest.mock('../../loggers', () => ({
    GlobalLogger: {
        error: jest.fn(),
    },
    RunnerLogger: {
        shellCmd: jest.fn(),
        teardown: jest.fn(),
        teardownSuccess: jest.fn(),
        stopContainer: jest.fn(),
        stopContainerSuccess: jest.fn(),
        removeContainer: jest.fn(),
        removeContainerSuccess: jest.fn(),
    },
}));
describe('teardownSingle', () => {
    beforeEach(() => {
        // @ts-ignore
        execa_1.default.shell.mockClear();
    });
    describe('happy', () => {
        it('should work', async () => {
            await teardownSingle_1.default(containerId, runnerKey);
            expect(loggers_1.RunnerLogger.shellCmd).toHaveBeenCalledWith(expect.stringMatching(/docker stop/));
            expect(execa_1.default.shell).toHaveBeenCalledWith(expect.stringMatching(/docker stop/));
            expect(loggers_1.RunnerLogger.shellCmd).toHaveBeenCalledWith(expect.stringMatching(/docker rm/));
            expect(execa_1.default.shell).toHaveBeenCalledWith(expect.stringMatching(/docker rm/));
            expect(loggers_1.GlobalLogger.error).not.toHaveBeenCalled();
        });
    });
    describe('sad', () => {
        it('should swallow errors', async () => {
            const error = new Error('no-bueno');
            // @ts-ignore
            execa_1.default.shell.mockImplementation(() => {
                throw error;
            });
            await teardownSingle_1.default(containerId, runnerKey);
            expect(loggers_1.RunnerLogger.shellCmd).toHaveBeenCalledWith(expect.stringMatching(/docker stop/));
            expect(loggers_1.GlobalLogger.error).toHaveBeenCalledWith(expect.stringMatching(/stop/), error);
            expect(loggers_1.RunnerLogger.shellCmd).toHaveBeenCalledWith(expect.stringMatching(/docker rm/));
            expect(loggers_1.GlobalLogger.error).toHaveBeenCalledWith(expect.stringMatching(/remove/), error);
        });
    });
});
//# sourceMappingURL=teardownSingle.spec.js.map