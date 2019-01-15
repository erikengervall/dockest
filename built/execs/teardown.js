"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const createTeardown = (Config, Logger) => {
    const config = Config.getConfig();
    const stopContainerById = async (containerId, progress) => {
        await execa_1.default.shell(`docker stop ${containerId}`);
        Logger.stop(`Container #${progress} with id <${containerId}> stopped`);
    };
    const removeContainerById = async (containerId, progress) => {
        await execa_1.default.shell(`docker rm ${containerId} --volumes`);
        Logger.stop(`Container #${progress} with id <${containerId}> removed`);
    };
    const dockerComposeDown = async () => {
        const timeout = 15;
        await execa_1.default.shell(`docker-compose down --volumes --rmi local --timeout ${timeout}`);
        Logger.stop('docker-compose: success');
    };
    const tearAll = async () => {
        Logger.loading('Teardown started');
        const containerIds = [
            ...config.postgres.reduce((acc, p) => p.$containerId ? acc.concat(p.$containerId) : acc, []),
        ];
        const containerIdsLen = containerIds.length;
        for (let i = 0; containerIdsLen > i; i++) {
            const progress = `${i + 1}/${containerIdsLen}`;
            const containerId = containerIds[i];
            await stopContainerById(containerId, progress);
            await removeContainerById(containerId, progress);
        }
        await dockerComposeDown(); // TODO: Read up on this
        Logger.success('Teardown successful');
    };
    return {
        stopContainerById,
        removeContainerById,
        dockerComposeDown,
        tearAll,
    };
};
exports.default = createTeardown;
