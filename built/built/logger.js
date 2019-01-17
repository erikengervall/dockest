"use strict";
// tslint:disable:no-console
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const logger = {
    info: (message, data = '') => {
        console.info(`${message}`, data);
    },
    loading: (message, data = '') => {
        console.info(`${constants_1.ICONS.LOADING} ${message}`, data);
    },
    stop: (message, data = '') => {
        console.info(`${constants_1.ICONS.STOPPED} ${message}`, data);
    },
    success: (message, data = '') => {
        console.info(`${constants_1.ICONS.SUCCESS} ${message}`, data, '\n');
    },
    failed: (message, data = '') => {
        console.error(`${constants_1.ICONS.FAILED} ${message}`, data, '\n');
    },
    error: (message, data = '') => {
        console.error(`${constants_1.ICONS.ERROR} ${message}`, data, '\n');
    },
};
exports.default = logger;
