"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigurationError_1 = __importDefault(require("../errors/ConfigurationError"));
const validateInputFields = (origin, requiredFields) => {
    const missingFields = Object.keys(requiredFields).reduce((acc, requiredField) => !!requiredFields[requiredField] ? acc : acc.concat(requiredField), []);
    if (missingFields.length !== 0) {
        throw new ConfigurationError_1.default(`Invalid ${origin} configuration, missing required fields: [${missingFields.join(', ')}]`);
    }
};
exports.validateInputFields = validateInputFields;
