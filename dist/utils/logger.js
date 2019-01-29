"use strict";
// tslint:disable:no-console
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const index_1 = __importDefault(require("../index"));
const { VERBOSE, LOADING, SUCCESS, FAILED, ERROR } = constants_1.ICONS;
const { BG: { WHITE }, FG: { BLACK, RED }, MISC: { RESET, BRIGHT }, } = constants_1.COLORS;
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
            console.log(`${VERBOSE} ${WHITE}${BLACK} Executed following shell script ${RESET}`, handleLogData(logData));
        }
    },
    setup: runnerKey => {
        const topSeparator = new Array(runnerKey.length * 2).fill(`-`).join('');
        const bottomSeparator = new Array(runnerKey.length * 2).fill(`-`).join('');
        console.log(`
${topSeparator}\n\
${BRIGHT}  ${runnerKey}: Setting up${RESET}\n\
${bottomSeparator}`);
    },
    setupSuccess: runnerKey => {
        const topSeparator = new Array(runnerKey.length * 2).fill(`/`).join('');
        const bottomSeparator = new Array(runnerKey.length * 2).fill(`/`).join('');
        console.log(`
${topSeparator}\n\
${BRIGHT}  ${runnerKey}: Setup successful${RESET}\n\
${bottomSeparator}`);
    },
    startContainer: runnerKey => {
        console.log(`${LOADING} ${BRIGHT}${runnerKey}: Starting container${RESET}`);
    },
    startContainerSuccess: runnerKey => {
        console.log(`${SUCCESS} ${BRIGHT}${runnerKey}: Container running${RESET}\n`);
    },
    checkHealth: runnerKey => {
        console.log(`${LOADING} ${BRIGHT}${runnerKey}: Healthchecking container${RESET}`);
    },
    checkHealthSuccess: runnerKey => {
        console.log(`${SUCCESS} ${BRIGHT}${runnerKey}: Container healthchecked${RESET}\n`);
    },
    checkResponsiveness: (runnerKey, timeout) => {
        console.log(`${LOADING} ${BRIGHT}${runnerKey}: Checking container's responsiveness (Timeout in: ${timeout}s)${RESET}`);
    },
    checkResponsivenessSuccess: runnerKey => {
        console.log(`${SUCCESS} ${BRIGHT}${runnerKey}: Container's responsiveness checked${RESET}`);
    },
    checkConnection: (runnerKey, timeout) => {
        console.log(`${LOADING} ${BRIGHT}${runnerKey}: Checking container's connection (Timeout in: ${timeout}s)${RESET}`);
    },
    checkConnectionSuccess: runnerKey => {
        console.log(`${SUCCESS} ${BRIGHT}${runnerKey}: Container's connection checked${RESET}`);
    },
    stopContainer: runnerKey => {
        console.log(`${LOADING} ${BRIGHT}${runnerKey}: Stopping container${RESET}`);
    },
    stopContainerSuccess: runnerKey => {
        console.log(`${SUCCESS} ${BRIGHT}${runnerKey}: Container stopped${RESET}\n`);
    },
    removeContainer: runnerKey => {
        console.log(`${LOADING} ${BRIGHT}${runnerKey}: Removing container${RESET}`);
    },
    removeContainerSuccess: runnerKey => {
        console.log(`${SUCCESS} ${BRIGHT}${runnerKey}: Container removed${RESET}\n`);
    },
    teardown: runnerKey => {
        console.log(`${LOADING} ${BRIGHT}${runnerKey}: Tearing down container${RESET}`);
    },
    teardownSuccess: runnerKey => {
        console.log(`${SUCCESS} ${BRIGHT}${runnerKey}: Container teared down${RESET}\n`);
    },
    loading: (message, logData = '') => {
        console.log(`${LOADING} ${BRIGHT}${message}${RESET}`, logData);
    },
    success: (message, logData = '') => {
        console.log(`${SUCCESS} ${BRIGHT}${message}${RESET}`, logData, '\n');
    },
    failed: (message, logData = '') => {
        console.log(`${FAILED} ${RED}${message}${RESET}`, logData, '\n');
    },
    error: (message, logData = '') => {
        console.log(`${ERROR} ${RED}${message}${RESET}`, logData, '\n');
    },
};
exports.default = logger;
//# sourceMappingURL=logger.js.map