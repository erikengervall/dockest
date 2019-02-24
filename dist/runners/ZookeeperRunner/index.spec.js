"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const config = {
    service: '_',
};
const ZookeeperRunner1 = new index_1.default(config);
const ZookeeperRunner2 = new index_1.default(config);
describe('ZookeeperRunner', () => {
    it('should create unique instances', () => {
        expect(ZookeeperRunner1).not.toBe(ZookeeperRunner2);
    });
});
//# sourceMappingURL=index.spec.js.map