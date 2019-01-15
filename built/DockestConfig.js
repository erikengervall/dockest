"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deepmerge_1 = __importDefault(require("deepmerge"));
const fs_1 = __importDefault(require("fs"));
const ConfigurationError_1 = __importDefault(require("./error/ConfigurationError"));
const DEFAULT_CONFIG = {
    jest: {
        projects: ['.'],
    },
    dockest: {
        verbose: false,
    },
    postgres: [],
};
class DockestConfig {
    constructor(userConfig) {
        this.validateRequiredFields = (origin, requiredFields) => {
            const missingFields = Object.keys(requiredFields).reduce((acc, requiredField) => !!requiredFields[requiredField] ? acc : acc.concat(requiredField), []);
            if (missingFields.length !== 0) {
                throw new ConfigurationError_1.default(`Invalid ${origin} configuration, missing required fields: [${missingFields.join(', ')}]`);
            }
        };
        this.validatePostgresConfigs = (postgresConfigs) => postgresConfigs.forEach(({ label, service, host, db, port, password, username }) => {
            const requiredFields = { label, service, host, db, port, password, username };
            this.validateRequiredFields('postgres', requiredFields);
        });
        this.validateJestConfig = (jestConfig) => {
            const { lib } = jestConfig;
            const requiredFields = { lib };
            this.validateRequiredFields('jest', requiredFields);
            if (typeof lib.runCLI !== 'function') {
                throw new ConfigurationError_1.default(`Invalid jest configuration, jest is missing runCLI method`);
            }
        };
        this.validateUserConfig = (config) => {
            const { postgres, jest } = config;
            if (!postgres && !jest) {
                throw new ConfigurationError_1.default('Missing something to dockerize');
            }
            this.validatePostgresConfigs(postgres);
            this.validateJestConfig(jest);
            if (!postgres) {
                config.postgres = [];
            }
        };
        const dockestRcFilePath = `${process.cwd()}/.dockestrc.js`;
        if (userConfig && typeof userConfig === 'object') {
            this.config = userConfig;
        }
        else if (fs_1.default.existsSync(dockestRcFilePath)) {
            this.config = require(dockestRcFilePath);
        }
        else {
            throw new ConfigurationError_1.default('Could not find ".dockestrc.js"');
        }
        if (this.config && typeof this.config === 'object') {
            this.config = deepmerge_1.default(DEFAULT_CONFIG, this.config);
        }
        else {
            throw new ConfigurationError_1.default('Configuration step failed');
        }
        this.validateUserConfig(this.config);
    }
    getConfig() {
        return this.config;
    }
}
exports.DockestConfig = DockestConfig;
exports.default = DockestConfig;
