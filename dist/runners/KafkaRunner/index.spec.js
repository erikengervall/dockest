"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const config = {
    service: '_',
    zookeepeerConnect: '_',
    topics: ['_'],
    host: '_',
};
const KafkaRunner1 = new index_1.default(config);
const KafkaRunner2 = new index_1.default(config);
describe('KafkaRunner', () => {
    it('should create unique instances', () => {
        expect(KafkaRunner1).not.toBe(KafkaRunner2);
    });
});
//# sourceMappingURL=index.spec.js.map