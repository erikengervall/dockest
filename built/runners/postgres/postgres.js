"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgresExecs_1 = __importDefault(require("../../execs/postgresExecs"));
class PostgresRunner {
    constructor(config) {
        this.config = config;
        this.postgresExec = new postgresExecs_1.default();
    }
    async setup() {
        const containerId = await this.postgresExec.start(this.config);
        this.containerId = containerId;
        await this.postgresExec.checkConnection(this.config);
        await this.postgresExec.checkResponsiveness(containerId, this.config);
    }
    async teardown() {
        this.postgresExec.teardown(this.containerId);
    }
    async getHelpers() {
        return {
            clear: () => true,
            loadData: () => true,
        };
    }
}
exports.PostgresRunner = PostgresRunner;
exports.default = PostgresRunner;
