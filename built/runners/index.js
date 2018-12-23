"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jest_1 = __importDefault(require("./jest"));
const kafka_1 = __importDefault(require("./kafka"));
const postgres_1 = __importDefault(require("./postgres"));
const redis_1 = __importDefault(require("./redis"));
const Runner = (resources) => {
    const { Config, Logger } = resources;
    const all = async () => {
        Logger.loading('Integration test initiated');
        const config = Config.getConfig();
        const { postgres: postgresConfigs, redis: redisConfigs, kafka: kafkaConfigs } = config;
        for (const postgresConfig of postgresConfigs) {
            await postgres_1.default(postgresConfig, resources);
        }
        for (const redisConfig of redisConfigs) {
            await redis_1.default(redisConfig, resources);
        }
        for (const kafkaConfig of kafkaConfigs) {
            await kafka_1.default(kafkaConfig, resources);
        }
        Logger.success('Dependencies up and running, ready for Jest unit tests');
        await jest_1.default(resources);
    };
    return {
        all,
    };
};
exports.default = Runner;
