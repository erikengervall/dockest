"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DockestError_1 = __importDefault(require("../error/DockestError"));
let attempts = 3;
const postGresRunner = async (postgresConfig, resources) => {
    const { Logger, Execs } = resources;
    const { postgres: { startPostgresContainer, checkPostgresResponsiveness }, helpers: { getContainerId, runCustomCommand }, teardown: { tearAll }, } = Execs;
    let containerId;
    containerId = await getContainerId(postgresConfig);
    postgresConfig.$containerId = containerId;
    if (!containerId || containerId.length === 0) {
        await startPostgresContainer(postgresConfig);
        containerId = await getContainerId(postgresConfig);
        postgresConfig.$containerId = containerId;
    }
    else {
        Logger.error('Unexpected container found, releasing resources and re-running');
        await tearAll(containerId);
        if (attempts <= 0) {
            throw new DockestError_1.default('Postgres rerun attempts exhausted');
        }
        attempts--;
        await postGresRunner(postgresConfig, resources);
        return;
    }
    await checkPostgresResponsiveness(containerId, postgresConfig);
    Logger.loading('Running Sequelize scripts');
    const commands = postgresConfig.commands || [];
    for (const cmd of commands) {
        await runCustomCommand(cmd);
    }
};
exports.default = postGresRunner;
