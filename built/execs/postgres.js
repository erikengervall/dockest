"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const DockestError_1 = __importDefault(require("../error/DockestError"));
const utils_1 = require("./utils");
const createPostgres = (Logger) => {
    const startPostgresContainer = async (postgresConfig) => {
        Logger.loading('Starting postgres container');
        const dockerComposeFile = ' '; // `-f ${Config.getConfig().dockest.dockerComposeFile}` || ''
        await execa_1.default.shell(`docker-compose up -d`);
        Logger.success('Postgres container started successfully');
    };
    const checkPostgresConnection = async (postgresConfig) => {
        Logger.loading('Attempting to establish database connection');
        const { connectionTimeout: timeout = 3, host, port } = postgresConfig;
        const recurse = async (timeout) => {
            Logger.info(`Establishing database connection (Timing out in: ${timeout}s)`);
            if (timeout <= 0) {
                throw new DockestError_1.default('Database connection timed out');
            }
            try {
                await execa_1.default.shell(`echo > /dev/tcp/${host}/${port}`);
                Logger.success('Database connection established');
            }
            catch (error) {
                timeout--;
                await utils_1.sleep(1000);
                await recurse(timeout);
            }
        };
        await recurse(timeout);
    };
    const checkPostgresResponsiveness = async (containerId, postgresConfig) => {
        Logger.loading('Attempting to establish database responsiveness');
        const { responsivenessTimeout: timeout = 10, host, username, db } = postgresConfig;
        const recurse = async (timeout) => {
            Logger.info(`Establishing database responsiveness (Timing out in: ${timeout}s)`);
            if (timeout <= 0) {
                throw new DockestError_1.default('Database responsiveness timed out');
            }
            try {
                await execa_1.default.shell(`docker exec ${containerId} bash -c "psql -h ${host} -U ${username} -d ${db} -c 'select 1'"`);
                Logger.success('Database responsiveness established');
            }
            catch (error) {
                timeout--;
                await utils_1.sleep(1000);
                await recurse(timeout);
            }
        };
        await recurse(timeout);
    };
    const postgresMigration = async () => {
        Logger.loading(`Applying database migrations`);
        const { stdout: result } = await execa_1.default.shell(`sequelize db:migrate`);
        Logger.success('Database migrations successfully executed', { result });
    };
    const postgresSeed = async (postgresConfig) => {
        const { seeder } = postgresConfig;
        Logger.loading('Applying database seeder');
        const { stdout: result } = await execa_1.default.shell(`sequelize db:seed:undo:all && sequelize db:seed --seed ${seeder}`);
        Logger.success('Database successfully seeded', { result });
    };
    return {
        startPostgresContainer,
        checkPostgresConnection,
        checkPostgresResponsiveness,
        postgresMigration,
        postgresSeed,
    };
};
exports.default = createPostgres;
