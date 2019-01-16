"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const DockestConfig_1 = __importDefault(require("../DockestConfig"));
const DockestLogger_1 = __importDefault(require("../DockestLogger"));
const DockestError_1 = __importDefault(require("../error/DockestError"));
const utils_1 = require("./utils");
const config = new DockestConfig_1.default().getConfig();
const logger = new DockestLogger_1.default();
const startContainer = async (runnerConfig) => {
    logger.loading('Starting postgres container');
    const { label, port, service } = runnerConfig;
    const dockerComposeFilePath = config.dockest.dockerComposeFilePath
        ? `--file ${config.dockest.dockerComposeFilePath}`
        : '';
    const { stdout: containerId } = await execa_1.default.shell(`docker-compose ${dockerComposeFilePath} run --detach --no-deps --label ${label} --publish ${port}:5432 ${service}`);
    logger.success('Postgres container started successfully');
    return containerId;
};
exports.startContainer = startContainer;
const checkConnection = async (runnerConfig) => {
    logger.loading('Attempting to establish database connection');
    const { connectionTimeout = 3, host, port } = runnerConfig;
    const recurse = async (connectionTimeout) => {
        logger.info(`Establishing database connection (Timing out in: ${connectionTimeout}s)`);
        if (connectionTimeout <= 0) {
            throw new DockestError_1.default('Database connection timed out');
        }
        try {
            await utils_1.acquireConnection(host, port);
            logger.success('Database connection established');
        }
        catch (error) {
            connectionTimeout--;
            await utils_1.sleep(1000);
            await recurse(connectionTimeout);
        }
    };
    await recurse(connectionTimeout);
};
exports.checkConnection = checkConnection;
const checkResponsiveness = async (containerId, runnerConfig) => {
    logger.loading('Attempting to establish database responsiveness');
    const { responsivenessTimeout = 10, host, username, db } = runnerConfig;
    const recurse = async (responsivenessTimeout) => {
        logger.info(`Establishing database responsiveness (Timing out in: ${responsivenessTimeout}s)`);
        if (responsivenessTimeout <= 0) {
            throw new DockestError_1.default('Database responsiveness timed out');
        }
        try {
            await execa_1.default.shell(`docker exec ${containerId} bash -c "psql -h ${host} -U ${username} -d ${db} -c 'select 1'"`);
            logger.success('Database responsiveness established');
        }
        catch (error) {
            responsivenessTimeout--;
            await utils_1.sleep(1000);
            await recurse(responsivenessTimeout);
        }
    };
    await recurse(responsivenessTimeout);
};
exports.checkResponsiveness = checkResponsiveness;
