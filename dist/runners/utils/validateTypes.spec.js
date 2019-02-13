"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const validateTypes_1 = __importDefault(require("./validateTypes"));
let config;
describe('validateTypes', () => {
    beforeEach(() => {
        config = {
            service: 'username',
            commands: ['first command', 'second command'],
            variousStuff: ['first command', 1, () => ({})],
            port: 1337,
            ports: [1337, 1338],
            autoCreateTopics: true,
            portMapping: { '1337': '1338' },
            logLevel: 1,
        };
    });
    describe('happy', () => {
        it('should work for valid config', () => {
            const validationSchema = {
                service: validateTypes_1.default.isString,
                commands: validateTypes_1.default.isArrayOfType(validateTypes_1.default.isString),
                variousStuff: validateTypes_1.default.isArray,
                port: validateTypes_1.default.isNumber,
                ports: validateTypes_1.default.isArrayOfType(validateTypes_1.default.isNumber),
                autoCreateTopics: validateTypes_1.default.isBoolean,
                portMapping: validateTypes_1.default.isObjectWithValuesOfType(validateTypes_1.default.isString),
                logLevel: validateTypes_1.default.isOneOf(Object.values(constants_1.LOG_LEVEL)),
            };
            const failures = validateTypes_1.default(validationSchema, config);
            expect(failures).toEqual([]);
        });
    });
    describe('sad', () => {
        it(`should return a failure right away if there's no config`, () => {
            const failures = validateTypes_1.default({}, undefined);
            expect(failures.length).toEqual(1);
            expect(failures[0]).toMatch(/No config found/);
        });
        it(`should return a failure for invalid config`, () => {
            config.service = 1;
            const validationSchema = {
                service: validateTypes_1.default.isString,
            };
            const failures = validateTypes_1.default(validationSchema, config);
            expect(failures.length).toEqual(1);
            expect(failures[0]).toMatch(/service: Expected string | Received number/);
        });
    });
});
//# sourceMappingURL=validateTypes.spec.js.map