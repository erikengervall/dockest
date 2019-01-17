"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DockestConfig_1 = __importDefault(require("./DockestConfig"));
const DockestLogger_1 = __importDefault(require("./DockestLogger"));
const jest_1 = __importDefault(require("./runners/jest"));
const config = new DockestConfig_1.default().getConfig();
const logger = new DockestLogger_1.default();
const run = async () => {
    logger.loading('Integration test initiated');
    const { runners } = config;
    // setup runners
    for (const runner of runners) {
        await runner.setup();
    }
    logger.success('Dependencies up and running, ready for Jest unit tests');
    // evaluate jest result
    const result = await jest_1.default();
    // teardown runners
    for (const runner of runners) {
        await runner.teardown();
    }
    result.success ? process.exit(0) : process.exit(1);
};
exports.default = run;
