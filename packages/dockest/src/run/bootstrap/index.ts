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
  config: { composeFile, mutables, perfStart, runMode, dumpErrors, exitHandler },
  dockestServices,
}: {
  config: DockestConfig;
  dockestServices: DockestService[];
}) => {
  setupExitHandler({ dumpErrors, exitHandler, mutables, perfStart });

  const { mergedComposeFiles } = await mergeComposeFiles(composeFile);

  const { dockerComposeFile } = getParsedComposeFile(mergedComposeFiles);

  const { dockerComposeFileWithVersion } = getComposeFilesWithVersion(composeFile, dockerComposeFile);

  const composeFilePath = writeComposeFile(mergedComposeFiles, dockerComposeFileWithVersion);

  const dockerEventEmitter = createDockerEventEmitter(composeFilePath);

  mutables.runners = transformDockestServicesToRunners({
    dockerComposeFile: dockerComposeFileWithVersion,
    dockestServices,
    runMode,
    dockerEventEmitter,
  });

  mutables.dockerEventEmitter = dockerEventEmitter;

  configureLogger(mutables.runners);
};
