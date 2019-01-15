"use strict";
// tslint:disable:no-console
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
class DockestLogger {
    constructor() {
        this.info = (message, data) => {
            console.info(`${message}`, data || '');
        };
        this.loading = (message, data) => {
            console.info(`${constants_1.ICONS.LOADING} ${message}`, data || '');
        };
        this.stop = (message, data) => {
            console.info(`${constants_1.ICONS.STOPPED} ${message}`, data || '');
        };
        this.success = (message, data) => {
            console.info(`${constants_1.ICONS.SUCCESS} ${message}`, data || '', '\n');
        };
        this.failed = (message, data) => {
            console.error(`${constants_1.ICONS.FAILED} ${message}`, data || '', '\n');
        };
        this.error = (message, data) => {
            console.error(`${constants_1.ICONS.ERROR} ${message}`, data || '', '\n');
        };
        if (DockestLogger.instance) {
            return DockestLogger.instance;
        }
        DockestLogger.instance = this;
    }
}
exports.DockestLogger = DockestLogger;
exports.default = DockestLogger;
