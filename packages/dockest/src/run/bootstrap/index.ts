import { configureLogger } from './configure-logger';
import { createDockerEventEmitter } from './create-docker-event-emitter';
import { getComposeFilesWithVersion } from './get-compose-files-with-version';
import { getParsedComposeFile } from './get-parsed-compose-file';
import { mergeComposeFiles } from './merge-compose-files';
import { setupExitHandler } from './setup-exit-handler';
import { transformDockestServicesToRunners } from './transform-dockest-services-to-runners';
import { writeComposeFile } from './write-compose-file';
import { DockestConfig, DockestService } from '../../@types';

export const bootstrap = async ({
  config,
  dockestServices,
}: {
  config: DockestConfig;
  dockestServices: DockestService[];
}) => {
  setupExitHandler({
    dumpErrors: config.dumpErrors,
    exitHandler: config.exitHandler,
    mutables: config.mutables,
    perfStart: config.perfStart,
  });

  const { mergedComposeFiles } = await mergeComposeFiles(config.composeFile);

  const { dockerComposeFile } = getParsedComposeFile(mergedComposeFiles);

  const { dockerComposeFileWithVersion } = getComposeFilesWithVersion(config.composeFile, dockerComposeFile);

  const composeFilePath = writeComposeFile(mergedComposeFiles, dockerComposeFileWithVersion);

  const dockerEventEmitter = createDockerEventEmitter(composeFilePath);

  config.mutables.runners = transformDockestServicesToRunners({
    dockerComposeFile: dockerComposeFileWithVersion,
    dockestServices,
    runMode: config.runMode,
    dockerEventEmitter,
  });

  config.mutables.dockerEventEmitter = dockerEventEmitter;

  configureLogger(config.mutables.runners);
};
