"use strict";
// tslint:disable:no-console
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const index_1 = __importDefault(require("../index"));
const { VERBOSE, LOADING, SUCCESS, FAILED, ERROR } = constants_1.ICONS;
const { BG: { YELLOW: BG_Y }, FG: { BLACK: FG_B, RED: FG_R }, MISC: { RESET: M_R, BRIGHT: M_B }, } = constants_1.COLORS;
const trim = (str = '') => str.replace(/\s+/g, ' ').trim();
const handleLogData = (logData) => {
    if (typeof logData === 'string') {
        return trim(logData);
    }
    return logData;
};
const logger = {
    command: (logData = '') => {
        if (index_1.default.config.dockest.verbose) {
            console.info(`${VERBOSE} ${BG_Y}${FG_B} Ran command ${M_R}`, handleLogData(logData));
        }
    },
    loading: (message, logData = '') => {
        console.info(`${LOADING} ${M_B}${message}${M_R}`, logData);
    },
    success: (message, logData = '') => {
        console.info(`${SUCCESS} ${M_B}${message}${M_R}`, logData, '\n');
    },
    failed: (message, logData = '') => {
        console.info(`${FAILED} ${FG_R}${message}${M_R}`, logData, '\n');
    },
    error: (message, logData = '') => {
        console.info(`${ERROR} ${FG_R}${message}${M_R}`, logData, '\n');
    },
};
exports.default = logger;
//# sourceMappingURL=logger.js.map