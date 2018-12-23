"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const createTeardown = (Config, Logger) => {
    const stopContainerById = async (containerId) => {
        await execa_1.default.shell(`docker stop ${containerId}`);
        Logger.stop(`Container with id <${containerId}> stopped`);
    };
    const removeContainerById = async (containerId) => {
        await execa_1.default.shell(`docker rm ${containerId} --volumes`);
        Logger.stop(`Container with id <${containerId}> removed`);
    };
    const dockerComposeDown = async () => {
        const timeout = 10;
        await execa_1.default.shell(`docker-compose down --volumes --rmi local --timeout ${timeout}`);
        Logger.stop('docker-compose down ran successfully');
    };
    const tearAll = async () => {
        Logger.loading('Teardown started');
        const containerIds = [
            ...Config.getConfig().kafka.map((k) => k.$.containerId),
            ...Config.getConfig().redis.map((r) => r.$.containerId),
            ...Config.getConfig().postgres.map((p) => p.$.containerId),
        ];
        for (let i = 0; containerIds.length > 0; i++) {
            const containerId = containerIds[i];
            if (containerId) {
                await stopContainerById(containerId);
                await removeContainerById(containerId);
                // await dockerComposeDown() // Causes issues with exit
            }
        }
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
