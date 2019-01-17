"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exitHandler_1 = __importDefault(require("./exitHandler"));
const logger_1 = __importDefault(require("./logger"));
const runners_1 = require("./runners");
const utils_1 = require("./utils");
const jest_1 = __importDefault(require("./jest"));
const { values } = Object;
class Dockest {
    constructor(userConfig) {
        this.run = async () => {
            exitHandler_1.default();
            logger_1.default.loading('Integration test initiated');
            const { runners } = Dockest.config;
            // setup runners
            for (const runner of values(runners)) {
                await runner.setup();
            }
            // evaluate jest result
            const jestRunner = new jest_1.default(Dockest.config.jest);
            const result = await jestRunner.run();
            // teardown runners
            for (const runner of values(runners)) {
                await runner.teardown();
            }
            result.success ? process.exit(0) : process.exit(1);
        };
        const { dockest, jest } = userConfig;
        const requiredProps = { dockest, jest, runners: exports.runners };
        utils_1.validateInputFields('Dockest', requiredProps);
        Dockest.config = userConfig;
    }
}
exports.runners = { PostgresRunner: runners_1.PostgresRunner };
exports.default = Dockest;
