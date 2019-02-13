"use strict";
// tslint:disable:no-console
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const index_1 = __importDefault(require("../index"));
const { LOADING, SUCCESS, INFO, FAILED } = constants_1.ICONS;
const { FG: { RED }, MISC: { RESET, BRIGHT }, } = constants_1.COLORS;
class BaseLogger {
    constructor() {
        this.IS_NOTHING = () => this.getLogLevel() >= constants_1.LOG_LEVEL.NOTHING;
        this.IS_ERROR = () => this.getLogLevel() >= constants_1.LOG_LEVEL.ERROR;
        this.IS_NORMAL = () => this.getLogLevel() >= constants_1.LOG_LEVEL.NORMAL;
        this.IS_VERBOSE = () => this.getLogLevel() >= constants_1.LOG_LEVEL.VERBOSE;
        this.trim = (str = '') => typeof str === 'string' ? str.replace(/\s+/g, ' ').trim() : str;
        this.logSuccess = (m, d) => console.log(`${SUCCESS} ${BRIGHT}${m}${RESET}`, this.defaultD(d), `\n`);
        this.logLoading = (m, d) => console.log(`${LOADING} ${BRIGHT}${m}${RESET}`, this.defaultD(d));
        this.logInfo = (m, d) => console.log(`${INFO} ${BRIGHT}${m}${RESET}`, this.defaultD(d));
        this.logError = (m, d) => console.log(`${FAILED} ${RED}${m}${RESET}`, this.defaultD(d), '\n');
        this.getLogLevel = () => index_1.default.jestEnv ? constants_1.LOG_LEVEL.NORMAL : index_1.default.config.dockest.logLevel;
        this.defaultD = (d) => d || '';
        return BaseLogger.baseLoggerInstance || (BaseLogger.baseLoggerInstance = this);
    }
}
exports.default = BaseLogger;
//# sourceMappingURL=BaseLogger.js.map