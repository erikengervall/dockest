"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const { FG: { RED, GREEN }, MISC: { RESET }, } = constants_1.COLORS;
const getExpected = (typeValidator) => typeValidator.expected || typeValidator.name.substring(2).toLowerCase();
const getReceived = (value) => isArray(value) ? `${typeof value[0]}[]` : `${value} (${typeof value})`;
const validateTypes = (schema, config) => {
    if (!config) {
        return [`${RED}No config found${RESET}`];
    }
    const failures = [];
    Object.keys(schema).forEach(schemaKey => {
        const value = config[schemaKey];
        if (value) {
            const typeValidator = schema[schemaKey];
            if (isArray(typeValidator)) {
                // Allow sending multiple thangz
            }
            if (!typeValidator(value)) {
                const testedSchemaKey = `${schemaKey}${RESET}`;
                const expected = `${RED}Expected${RESET} ${getExpected(typeValidator)}`;
                const received = `${GREEN}Received${RESET} ${getReceived(value)}`;
                failures.push(`${testedSchemaKey}: ${expected} | ${received}`);
            }
        }
        else {
            failures.push(`${RED}${schemaKey}${RESET}: Schema-key missing in config`);
        }
    });
    return failures;
};
const isString = _ => (_ && typeof _ === 'string') || _ instanceof String;
const isNumber = _ => _ && typeof _ === 'number' && isFinite(_);
const isArray = (_) => _ && typeof _ === 'object' && _.constructor === Array;
const isArrayOfType = (fn) => {
    const isArrayOfType = (_) => isArray(_) && !_.some((_) => !fn(_));
    isArrayOfType.expected = `${fn.name.substring(2).toLowerCase()}[]`;
    return isArrayOfType;
};
const isFunction = _ => _ && typeof _ === 'function';
const isObject = _ => _ && typeof _ === 'object' && _.constructor === Object;
const isObjectWithValuesOfType = (fn) => {
    const isObjectWithValuesOfType = (_) => isObject(_) && !Object.values(_).some((_) => !fn(_));
    isObjectWithValuesOfType.expected = `{ [prop: string]: ${fn.name.substring(2).toLowerCase()} }`;
    return isObjectWithValuesOfType;
};
const isNull = _ => _ === null;
const isUndefined = _ => typeof _ === 'undefined';
const isBoolean = _ => _ && typeof _ === 'boolean';
const isRegExp = _ => _ && typeof _ === 'object' && _.constructor === RegExp;
const isError = _ => _ && _ instanceof Error && typeof _.message !== 'undefined';
const isDate = _ => _ && _ instanceof Date;
const isSymbol = _ => _ && typeof _ === 'symbol';
const isAny = _ => _ && !isNull(_) && !isUndefined(_);
const isOneOf = (haystack) => {
    const isOneOf = (needle) => isArray(haystack) && !!haystack.find(_ => _ === needle);
    isOneOf.expected = `oneOf [${haystack.join(', ')}]`;
    return isOneOf;
};
const OR = 'OR';
const AND = 'AND';
validateTypes.isString = isString;
validateTypes.isNumber = isNumber;
validateTypes.isArray = isArray;
validateTypes.isArrayOfType = isArrayOfType;
validateTypes.isFunction = isFunction;
validateTypes.isObject = isObject;
validateTypes.isObjectWithValuesOfType = isObjectWithValuesOfType;
validateTypes.isNull = isNull;
validateTypes.isUndefined = isUndefined;
validateTypes.isBoolean = isBoolean;
validateTypes.isRegExp = isRegExp;
validateTypes.isError = isError;
validateTypes.isDate = isDate;
validateTypes.isSymbol = isSymbol;
validateTypes.isAny = isAny;
validateTypes.isOneOf = isOneOf;
validateTypes.OR = OR;
validateTypes.AND = AND;
exports.default = validateTypes;
//# sourceMappingURL=validateTypes.js.map