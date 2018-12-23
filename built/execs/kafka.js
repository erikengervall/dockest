"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const DockestError_1 = __importDefault(require("../error/DockestError"));
const utils_1 = require("./utils");
const createKafka = (Logger) => {
    const startKafkaContainer = async (kafkaConfig) => {
        Logger.loading('Starting Kafka container');
        const { label, port } = kafkaConfig;
        const dockerComposeFile = ''; // `-f ${Config.getConfig().dockest.dockerComposeFile}` || ''
        const { stdout: hostIp } = await execa_1.default(`ifconfig 
      | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" 
      | grep -v 127.0.0.1 
      | awk '{ print $2 }' 
      | cut -f2 -d: 
      | head -n1`);
        Logger.info(`Current machines local IP: ${hostIp}`);
        await execa_1.default.shell(`docker-compose run -d ${dockerComposeFile} 
      --label ${label} 
      -p ${port}:${port} 
      -e kafka_hostname="" 
      -e kafka_advertised_hostname=${hostIp} 
      -e kafka_auto_create_topics_enable=true kafka`);
        Logger.success('Kafka container started successfully');
    };
    const checkKafkaConnection = async (kafkaConfig) => {
        Logger.loading('Attempting to establish Kafka connection');
        const { connectionTimeout: timeout = 3 } = kafkaConfig;
        const recurse = async (timeout) => {
            Logger.info(`Establishing Kafka connection (Timing out in: ${timeout}s)`);
            if (timeout <= 0) {
                throw new DockestError_1.default('Kafka connection timed out');
            }
            try {
                await execa_1.default.shell(`curl -s -o /dev/null -w "%{http_code}" http://localhost:9082`);
                Logger.success('Kafka connection established');
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
        startKafkaContainer,
        checkKafkaConnection,
    };
};
exports.default = createKafka;
