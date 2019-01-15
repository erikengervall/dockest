"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const DockestConfig_1 = __importDefault(require("../DockestConfig"));
const DockestLogger_1 = __importDefault(require("../DockestLogger"));
const DockestError_1 = __importDefault(require("../error/DockestError"));
const config = new DockestConfig_1.default().getConfig();
const logger = new DockestLogger_1.default();
exports.stopContainerById = async (containerId, progress) => {
    await execa_1.default.shell(`docker stop ${containerId}`);
    logger.stop(`Container #${progress} with id <${containerId}> stopped`);
};
exports.removeContainerById = async (containerId, progress) => {
    await execa_1.default.shell(`docker rm ${containerId} --volumes`);
    logger.stop(`Container #${progress} with id <${containerId}> removed`);
};
exports.dockerComposeDown = async () => {
    const timeout = 15;
    await execa_1.default.shell(`docker-compose down --volumes --rmi local --timeout ${timeout}`);
    logger.stop('docker-compose: success');
};
exports.tearSingle = async (containerId, progress = '1') => {
    if (!containerId) {
        throw new DockestError_1.default(`tearSingle: No containerId`);
    }
    logger.loading('Teardown started');
    await exports.stopContainerById(containerId, progress);
    await exports.removeContainerById(containerId, progress);
    await exports.dockerComposeDown(); // TODO: Read up on this
    logger.success('Teardown successful');
};
exports.tearAll = async () => {
    logger.loading('Teardown started');
    const containerIds = [
        ...config.runners.reduce((acc, postgresRunner) => postgresRunner.$containerId ? acc.concat(postgresRunner.$containerId) : acc, []),
    ];
    const containerIdsLen = containerIds.length;
    for (let i = 0; containerIdsLen > i; i++) {
        const progress = `${i + 1}/${containerIdsLen}`;
        const containerId = containerIds[i];
        await exports.stopContainerById(containerId, progress);
        await exports.removeContainerById(containerId, progress);
    }
    await exports.dockerComposeDown(); // TODO: Read up on this
    logger.success('Teardown successful');
};
