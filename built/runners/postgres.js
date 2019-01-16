"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = require("../execs/postgres");
const teardown_1 = require("../execs/teardown");
class PostgresRunner {
    constructor(config) {
        this.config = config;
    }
    async setup() {
        const containerId = await postgres_1.startPostgresContainer(this.config);
        this.containerId = containerId;
        await postgres_1.checkPostgresResponsiveness(containerId, this.config);
    }
    async teardown() {
        teardown_1.tearSingle(this.containerId);
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
