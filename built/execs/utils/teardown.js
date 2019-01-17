"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const DockestConfig_1 = __importDefault(require("../../DockestConfig"));
const DockestLogger_1 = __importDefault(require("../../DockestLogger"));
const DockestError_1 = __importDefault(require("../../errors/DockestError"));
const config = new DockestConfig_1.default().getConfig();
const logger = new DockestLogger_1.default();
class Teardown {
    constructor() {
        this.tearSingle = async (containerId, progress = '1') => {
            if (!containerId) {
                throw new DockestError_1.default(`${this.tearSingle.name}: No containerId`);
            }
            logger.loading('Teardown started');
            await this.stopContainerById(containerId, progress);
            await this.removeContainerById(containerId, progress);
            await this.dockerComposeDown(); // TODO: Read up on this
            logger.success('Teardown successful');
        };
        this.tearAll = async () => {
            logger.loading('Teardown started');
            const containerIds = [
                ...config.runners.reduce((acc, postgresRunner) => postgresRunner.containerId ? acc.concat(postgresRunner.containerId) : acc, []),
            ];
            const containerIdsLen = containerIds.length;
            for (let i = 0; containerIdsLen > i; i++) {
                const progress = `${i + 1}/${containerIdsLen}`;
                const containerId = containerIds[i];
                await this.stopContainerById(containerId, progress);
                await this.removeContainerById(containerId, progress);
            }
            await this.dockerComposeDown(); // TODO: Read up on this
            logger.success('Teardown successful');
        };
        this.stopContainerById = async (containerId, progress) => {
            await execa_1.default.shell(`docker stop ${containerId}`);
            logger.stop(`Container #${progress} with id <${containerId}> stopped`);
        };
        this.removeContainerById = async (containerId, progress) => {
            await execa_1.default.shell(`docker rm ${containerId} --volumes`);
            logger.stop(`Container #${progress} with id <${containerId}> removed`);
        };
        this.dockerComposeDown = async () => {
            const timeout = 15;
            await execa_1.default.shell(`docker-compose down --volumes --rmi local --timeout ${timeout}`);
            logger.stop('docker-compose: success');
        };
        if (Teardown.instance) {
            return Teardown.instance;
        }
    }
}
exports.default = Teardown;
