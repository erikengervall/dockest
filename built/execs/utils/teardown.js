"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const DockestError_1 = __importDefault(require("../../errors/DockestError"));
const index_1 = __importDefault(require("../../index"));
const logger_1 = __importDefault(require("../../logger"));
const { values } = Object;
const tearSingle = async (containerId, progress = '1') => {
    if (!containerId) {
        throw new DockestError_1.default(`No containerId`);
    }
    logger_1.default.loading('Teardown started');
    await stopContainerById(containerId, progress);
    await removeContainerById(containerId, progress);
    logger_1.default.success('Teardown successful');
};
exports.tearSingle = tearSingle;
const tearAll = async () => {
    logger_1.default.loading('Teardown started');
    const config = index_1.default.config;
    const containerIds = [
        ...values(config.runners).reduce((acc, postgresRunner) => postgresRunner.containerId ? acc.concat(postgresRunner.containerId) : acc, []),
    ];
    for (let i = 0; containerIds.length > i; i++) {
        const progress = `${i + 1}/${containerIds.length}`;
        const containerId = containerIds[i];
        await stopContainerById(containerId, progress);
        await removeContainerById(containerId, progress);
    }
    logger_1.default.success('Teardown successful');
};
exports.tearAll = tearAll;
const stopContainerById = async (containerId, progress) => {
    await execa_1.default.shell(`docker stop ${containerId}`);
    logger_1.default.success(`Container #${progress} with id <${containerId}> stopped`);
};
const removeContainerById = async (containerId, progress) => {
    await execa_1.default.shell(`docker rm ${containerId} --volumes`);
    logger_1.default.success(`Container #${progress} with id <${containerId}> removed`);
};
// Deprecated
const dockerComposeDown = async () => {
    const timeout = 15;
    await execa_1.default.shell(`docker-compose down --volumes --rmi local --timeout ${timeout}`);
    logger_1.default.success('docker-compose: success');
};
exports.dockerComposeDown = dockerComposeDown;
