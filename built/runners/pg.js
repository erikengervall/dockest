"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DockestLogger_1 = __importDefault(require("../DockestLogger"));
class PostgresRunner {
    constructor() {
        const logger = new DockestLogger_1.default();
        logger.info('hola');
    }
    async setup() { }
    async teardown() { }
    async getHelpers() { }
}
exports.default = PostgresRunner;
