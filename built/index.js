"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const teardown_1 = require("./execs/utils/teardown");
const exitHandler_1 = __importDefault(require("./exitHandler"));
const logger_1 = __importDefault(require("./logger"));
const runners_1 = __importStar(require("./runners"));
const utils_1 = require("./utils");
class Dockest {
    constructor(userConfig) {
        this.run = async () => {
            const logger = new logger_1.default();
            exitHandler_1.default();
            try {
                await runners_1.default();
            }
            catch (error) {
                logger.error('Unexpected error', error);
                await teardown_1.tearAll();
                process.exit(1);
            }
        };
        const { dockest, jest } = userConfig;
        const requiredProps = { dockest, jest, runners: exports.runners };
        utils_1.validateInputFields('Dockest', requiredProps);
        Dockest.config = userConfig;
    }
}
exports.runners = { PostgresRunner: runners_1.PostgresRunner };
exports.default = Dockest;
