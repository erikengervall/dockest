"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const validateInputFields = (origin, requiredFields) => {
    const missingFields = Object.keys(requiredFields).reduce((acc, requiredField) => !!requiredFields[requiredField] ? acc : acc.concat(requiredField), []);
    if (missingFields.length !== 0) {
        throw new errors_1.ConfigurationError(`Invalid ${origin} configuration, missing required fields: [${missingFields.join(', ')}]`);
    }
};
exports.validateInputFields = validateInputFields;
