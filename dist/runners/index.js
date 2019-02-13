"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const KafkaRunner_1 = __importDefault(require("./KafkaRunner"));
const PostgresRunner_1 = __importDefault(require("./PostgresRunner"));
const RedisRunner_1 = __importDefault(require("./RedisRunner"));
const ZookeeperRunner_1 = __importDefault(require("./ZookeeperRunner"));
const runners = { KafkaRunner: KafkaRunner_1.default, PostgresRunner: PostgresRunner_1.default, RedisRunner: RedisRunner_1.default, ZookeeperRunner: ZookeeperRunner_1.default };
exports.runners = runners;
//# sourceMappingURL=index.js.map