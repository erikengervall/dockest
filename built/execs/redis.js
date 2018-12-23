"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const DockestError_1 = __importDefault(require("../error/DockestError"));
const utils_1 = require("./utils");
const createRedis = (Logger) => {
    const startRedisContainer = async () => {
        Logger.loading('Starting Redis container');
        await execa_1.default.shell('');
        Logger.success('Redis container started successfully');
    };
    const checkRedisConnection = async (redisConfig) => {
        Logger.loading('Attempting to establish Redis connection');
        const { connectionTimeout: timeout = 3 } = redisConfig;
        const recurse = async (timeout) => {
            Logger.info(`Establishing Redis connection (Timing out in: ${timeout}s)`);
            if (timeout <= 0) {
                throw new DockestError_1.default('Redis connection timed out');
            }
            try {
                await execa_1.default.shell('');
                Logger.success('Redis connection established');
            }
            catch (error) {
                timeout--;
                await utils_1.sleep(1000);
                await recurse(timeout);
            }
        };
        await recurse(timeout);
    };
    return {
        startRedisContainer,
        checkRedisConnection,
    };
};
exports.default = createRedis;
