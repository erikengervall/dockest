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
    runners: [],
};
class DockestConfig {
    constructor(userConfig) {
        this.validateRequiredFields = (origin, requiredFields) => {
            const missingFields = Object.keys(requiredFields).reduce((acc, requiredField) => !!requiredFields[requiredField] ? acc : acc.concat(requiredField), []);
            if (missingFields.length !== 0) {
                throw new ConfigurationError_1.default(`Invalid ${origin} configuration, missing required fields: [${missingFields.join(', ')}]`);
            }
        };
        this.validateJestConfig = (jestConfig) => {
            const { lib } = jestConfig;
            const requiredFields = { lib };
            this.validateRequiredFields('jest', requiredFields);
            if (typeof lib.runCLI !== 'function') {
                throw new ConfigurationError_1.default(`Invalid jest configuration, jest is missing runCLI method`);
            }
        };
        this.validateUserConfig = (config) => {
            const { runners, jest } = config;
            if (!runners && !jest) {
                throw new ConfigurationError_1.default('Missing something to dockerize');
            }
            this.validateJestConfig(jest);
        };
        if (DockestConfig.instance) {
            return DockestConfig.instance;
        }
        const dockestRcFilePath = `${process.cwd()}/.dockestrc.js`;
        if (userConfig && typeof userConfig === 'object') {
            DockestConfig.config = userConfig;
        }
        else if (fs_1.default.existsSync(dockestRcFilePath)) {
            DockestConfig.config = require(dockestRcFilePath);
        }
        else {
            throw new ConfigurationError_1.default('Could not find ".dockestrc.js"');
        }
        if (DockestConfig.config && typeof DockestConfig.config === 'object') {
            DockestConfig.config = deepmerge_1.default(DEFAULT_CONFIG, DockestConfig.config);
        }
        else {
            throw new ConfigurationError_1.default('Configuration step failed');
        }
        this.validateUserConfig(DockestConfig.config);
        DockestConfig.instance = this;
    }
    getConfig() {
        return DockestConfig.config;
    }
}
exports.DockestConfig = DockestConfig;
exports.default = DockestConfig;
