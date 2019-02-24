"use strict";
// tslint:disable:no-console
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
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
        this.logInfo = (m, d) => console.log(`${INFO}  ${BRIGHT}${m}${RESET}`, this.defaultD(d));
        this.logError = (m, d) => console.log(`${FAILED} ${RED}${m}${RESET}`, this.defaultD(d), '\n');
        this.getLogLevel = () => BaseLogger.logLevel;
        this.defaultD = (d) => d || '';
        return BaseLogger.baseLoggerInstance || (BaseLogger.baseLoggerInstance = this);
    }
}
// Due to Jest running in a node VM, the logLevel has to be defaulted
BaseLogger.logLevel = constants_1.LOG_LEVEL.NORMAL;
exports.default = BaseLogger;
//# sourceMappingURL=BaseLogger.js.map