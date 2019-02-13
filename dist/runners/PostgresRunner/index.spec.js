"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const config = {
    service: 'anything',
    host: 'anything',
    database: 'anything',
    port: 1,
    password: 'anything',
    username: 'anything',
    commands: [],
    connectionTimeout: 1,
    responsivenessTimeout: 1,
};
const postgresRunner1 = new index_1.default(config);
const postgresRunner2 = new index_1.default(config);
describe('PostgresRunner', () => {
    it('should create unique instances', () => {
        expect(postgresRunner1).not.toBe(postgresRunner2);
        expect(postgresRunner1).not.toBe(postgresRunner2);
    });
});
//# sourceMappingURL=index.spec.js.map