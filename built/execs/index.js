"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("./helpers"));
const kafka_1 = __importDefault(require("./kafka"));
const postgres_1 = __importDefault(require("./postgres"));
const redis_1 = __importDefault(require("./redis"));
const teardown_1 = __importDefault(require("./teardown"));
class DockestExecs {
    constructor(Config, Logger) {
        this.postgres = postgres_1.default(Logger);
        this.redis = redis_1.default(Logger);
        this.kafka = kafka_1.default(Logger);
        this.teardown = teardown_1.default(Config, Logger);
        this.helpers = helpers_1.default(Logger);
    }
}
exports.DockestExecs = DockestExecs;
exports.default = DockestExecs;
