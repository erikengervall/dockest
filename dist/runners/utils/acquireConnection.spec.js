"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const acquireConnection_1 = __importDefault(require("./acquireConnection"));
const port = 1337;
jest.mock('net', () => ({
    createConnection: jest.fn(function (_) {
        // @ts-ignore
        return this;
    }),
    on: jest.fn(function (event) {
        if (event === 'connect') {
            //
        }
        else if (event === 'error') {
            //
        }
        // @ts-ignore
        return this;
    }),
}));
// TODO:
describe.skip('acquireConnection', () => {
    it('should acquire connection', async () => {
        await acquireConnection_1.default(port);
        expect(net_1.default.createConnection).toHaveBeenCalled();
    });
});
//# sourceMappingURL=acquireConnection.spec.js.map