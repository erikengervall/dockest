"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sleep_1 = __importDefault(require("./sleep"));
const defaultSleep = 1000;
describe('sleep', () => {
    describe('happy', () => {
        it('should sleep for default time', async () => {
            const flakynessBuffer = 5;
            const beforeSleep = Date.now();
            await sleep_1.default();
            const afterSleep = Date.now() + flakynessBuffer;
            const totalSleep = afterSleep - beforeSleep;
            expect(totalSleep).toBeGreaterThan(defaultSleep);
        });
        it('should sleep for custom time', async () => {
            const flakynessBuffer = 5;
            const customSleep = 100;
            const beforeSleep = Date.now();
            await sleep_1.default(customSleep);
            const afterSleep = Date.now() + flakynessBuffer;
            const totalSleep = afterSleep - beforeSleep;
            expect(totalSleep).toBeGreaterThan(customSleep);
        });
    });
});
//# sourceMappingURL=sleep.spec.js.map