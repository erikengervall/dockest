"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DockestConfig_1 = __importDefault(require("../DockestConfig"));
const DockestLogger_1 = __importDefault(require("../DockestLogger"));
const jest_1 = __importDefault(require("./jest"));
const config = new DockestConfig_1.default().getConfig();
const logger = new DockestLogger_1.default();
exports.run = async () => {
    logger.loading('Integration test initiated');
    const { runners } = config;
    for (const runner of runners) {
        await runner.setup();
    }
    logger.success('Dependencies up and running, ready for Jest unit tests');
    await jest_1.default();
};
