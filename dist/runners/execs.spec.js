"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execs_1 = __importDefault(require("./KafkaRunner/execs"));
const execs_2 = __importDefault(require("./PostgresRunner/execs"));
const execs_3 = __importDefault(require("./RedisRunner/execs"));
const execs_4 = __importDefault(require("./ZookeeperRunner/execs"));
const execs = {
    KafkaExec: execs_1.default,
    PostgresExec: execs_2.default,
    RedisExec: execs_3.default,
    ZookeeperExec: execs_4.default,
};
describe('Execs', () => {
    Object.keys(execs).forEach(key => {
        it(`${key} should be a singleton`, () => {
            const exec1 = new execs[key]();
            const exec2 = new execs[key]();
            expect(exec1).toBe(exec2);
        });
    });
});
//# sourceMappingURL=execs.spec.js.map