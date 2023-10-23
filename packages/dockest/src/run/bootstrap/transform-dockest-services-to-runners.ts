import { DockerEventEmitter } from './create-docker-event-emitter';
import { createDockerServiceEventStream } from './create-docker-service-event-stream';
import { DockerComposeFile, DockestConfig, DockestService, Runner, RunnersObj } from '../../@types';
import { ConfigurationError } from '../../errors';
import { Logger } from '../../logger';

export const transformDockestServicesToRunners = ({
  dockerComposeFile,
  dockestServices,
  runMode,
  dockerEventEmitter,
}: {
  dockerComposeFile: DockerComposeFile;
  dockestServices: DockestService[];
  runMode: DockestConfig['runMode'];
  dockerEventEmitter: DockerEventEmitter;
}) => {
  const createRunner = (dockestService: DockestService) => {
    const { commands = [], dependsOn = [], readinessCheck = () => Promise.resolve(), serviceName } = dockestService;

    const dockerComposeFileService = dockerComposeFile.services[serviceName];
    if (!dockerComposeFileService) {
      throw new ConfigurationError(
        `Unable to find compose service "${serviceName}", make sure that the serviceName corresponds with your Compose File's service`,
      );
    }

    const runner: Runner = {
      commands,
      containerId: '',
      dependsOn: dependsOn.map(createRunner),
      dockerComposeFileService,
      dockerEventStream$: createDockerServiceEventStream(serviceName, dockerEventEmitter),
      logger: new Logger(serviceName),
      readinessCheck,
      serviceName,
    };

    if (runMode === 'docker-injected-host-socket') {
      runner.host = serviceName;
      runner.isBridgeNetworkMode = true;
    }

    return runner;
  };

  return dockestServices.reduce((acc: RunnersObj, dockestService) => {
    acc[dockestService.serviceName] = createRunner(dockestService);

    return acc;
  }, {});
};
