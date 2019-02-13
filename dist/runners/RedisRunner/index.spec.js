"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const config = {
    service: '_',
};
const RedisRunner1 = new index_1.default(config);
const RedisRunner2 = new index_1.default(config);
describe('RedisRunner', () => {
    it('should create unique instances', () => {
        expect(RedisRunner1).not.toBe(RedisRunner2);
    });
});
//# sourceMappingURL=index.spec.js.map