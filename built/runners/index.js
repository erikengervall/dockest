"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require("../"));
const logger_1 = __importDefault(require("../logger"));
const jest_1 = __importDefault(require("./jest"));
const postgres_1 = __importDefault(require("./postgres"));
exports.PostgresRunner = postgres_1.default;
const { values } = Object;
const logger = new logger_1.default();
const run = async () => {
    logger.loading('Integration test initiated');
    const { runners } = __1.default.config;
    // setup runners
    for (const runner of values(runners)) {
        await runner.setup();
    }
    // evaluate jest result
    const jestRunner = new jest_1.default(__1.default.config.jest);
    const result = await jestRunner.run();
    // teardown runners
    for (const runner of values(runners)) {
        await runner.teardown();
    }
    result.success ? process.exit(0) : process.exit(1);
};
exports.default = run;
