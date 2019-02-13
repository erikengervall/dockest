"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const config = {
    service: '_',
    database: '_',
    password: '_',
    username: '_',
};
const postgresRunner1 = new index_1.default(config);
const postgresRunner2 = new index_1.default(config);
describe('PostgresRunner', () => {
    it('should create unique instances', () => {
        expect(postgresRunner1).not.toBe(postgresRunner2);
    });
});
//# sourceMappingURL=index.spec.js.map