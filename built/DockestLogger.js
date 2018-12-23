"use strict";
// tslint:disable:no-console
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
class DockestLogger {
    constructor(Config) {
        this.info = (message, data) => {
            console.info(`${message}`, data || '');
        };
        this.loading = (message, data) => {
            console.info(`${constants_1.EMOJIS.LOADING} ${message}`, data || '');
        };
        this.stop = (message, data) => {
            console.info(`${constants_1.EMOJIS.STOPPED} ${message}`, data || '');
        };
        this.success = (message, data) => {
            console.info(`${constants_1.EMOJIS.SUCCESS} ${message}`, data || '', '\n');
        };
        this.failed = (message, data) => {
            console.error(`${constants_1.EMOJIS.FAILED} ${message}`, data || '', '\n');
        };
        this.error = (message, data) => {
            console.error(`${constants_1.EMOJIS.ERROR} ${message}`, data || '', '\n');
        };
        const config = Config.getConfig();
        this.verbose = !!config.dockest.verbose;
    }
}
exports.DockestLogger = DockestLogger;
exports.default = DockestLogger;
