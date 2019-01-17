"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deepmerge_1 = __importDefault(require("deepmerge"));
const ConfigurationError_1 = __importDefault(require("./errors/ConfigurationError"));
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
        this.validateJestConfig = (jestConfig) => {
            const { lib } = jestConfig;
            const requiredFields = { lib };
            validateInputFields('jest', requiredFields);
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
        DockestConfig.config = userConfig;
        if (DockestConfig.config && typeof DockestConfig.config === 'object') {
            DockestConfig.config = deepmerge_1.default(DEFAULT_CONFIG, DockestConfig.config);
        }
        else {
            throw new ConfigurationError_1.default('Configuration step failed');
        }
        this.validateUserConfig(DockestConfig.config);
        DockestConfig.instance = this;
    }
}
DockestConfig.getConfig = () => DockestConfig.instance;
exports.DockestConfig = DockestConfig;
const validateInputFields = (origin, requiredFields) => {
    const missingFields = Object.keys(requiredFields).reduce((acc, requiredField) => !!requiredFields[requiredField] ? acc : acc.concat(requiredField), []);
    if (missingFields.length !== 0) {
        throw new ConfigurationError_1.default(`Invalid ${origin} configuration, missing required fields: [${missingFields.join(', ')}]`);
    }
};
// export { validateInputFields }
// export default DockestConfig
