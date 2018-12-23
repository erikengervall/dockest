"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const ConfigurationError_1 = __importDefault(require("./error/ConfigurationError"));
const DEFAULT_CONFIG = {
    jest: {
        projects: ['.'],
        $: {},
    },
    dockest: {
        verbose: false,
        $: {},
    },
    postgres: [{ $: {} }],
    redis: [{ $: {} }],
    kafka: [{ $: {} }],
};
const validateConfig = config => {
    if (!config.postgres && !config.kafka) {
        throw new ConfigurationError_1.default('Missing something to dockerize');
    }
    if (!config.postgres) {
        config.postgres = [];
    }
    if (!config.redis) {
        config.redis = [];
    }
    if (!config.kafka) {
        config.kafka = [];
    }
};
class DockestConfig {
    constructor(userConfig) {
        const cwd = process.cwd();
        let configRc;
        if (userConfig) {
            configRc = userConfig;
        }
        else if (fs_1.default.existsSync(`${cwd}/.dockestrc.js`)) {
            configRc = require(`${cwd}/.dockestrc.js`);
        }
        else {
            throw new ConfigurationError_1.default('Could not find ".dockestrc.js"');
        }
        if (configRc && typeof configRc === 'object') {
            this.config = Object.assign({}, DEFAULT_CONFIG, configRc);
            this.config.postgres.map(p => (p.$ = { containerId: '' }));
            this.config.redis.map(r => (r.$ = { containerId: '' }));
            this.config.kafka.map(k => (k.$ = { containerId: '' }));
        }
        else {
            throw new ConfigurationError_1.default('Something went wrong when attempting to parse ".dockestrc.js"');
        }
        validateConfig(this.config);
    }
    getConfig() {
        return this.config;
    }
}
exports.DockestConfig = DockestConfig;
exports.default = DockestConfig;
