"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const loggers_1 = require("../../loggers");
const getContainerId_1 = __importDefault(require("./getContainerId"));
const serviceName = 'mockServiceName';
const stdout = `mockStdout`;
jest.mock('execa', () => ({
    shell: jest.fn(() => ({
        stdout,
    })),
}));
jest.mock('../../loggers', () => ({
    RunnerLogger: {
        shellCmd: jest.fn(),
    },
}));
describe('getContainerId', () => {
    it('should work', async () => {
        const containerId = await getContainerId_1.default(serviceName);
        expect(loggers_1.RunnerLogger.shellCmd).toHaveBeenCalledWith(expect.stringMatching(/docker ps/));
        expect(execa_1.default.shell).toHaveBeenCalledWith(expect.stringMatching(/docker ps/));
        expect(execa_1.default.shell).lastReturnedWith({ stdout });
        expect(containerId).toEqual(stdout);
    });
});
//# sourceMappingURL=getContainerId.spec.js.map