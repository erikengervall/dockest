import { configureLogger } from './configure-logger';
import { createDockerEventEmitter } from './create-docker-event-emitter';
import { getParsedComposeFile } from './get-parsed-compose-file';
import { mergeComposeFiles } from './merge-compose-files';
import { transformDockestServicesToRunners } from './transform-dockest-services-to-runners';
import { writeComposeFile } from './write-compose-file';
import { DockestConfig, DockestService } from '../../@types';

export const bootstrap = async ({
  composeFile,
  dockestServices,
  runMode,
  mutables,
}: {
  composeFile: DockestConfig['composeFile'];
  dockestServices: DockestService[];
  runMode: DockestConfig['runMode'];
  mutables: DockestConfig['mutables'];
}) => {
  const { mergedComposeFiles } = await mergeComposeFiles(composeFile);

  const { dockerComposeFile } = getParsedComposeFile(mergedComposeFiles);

  mutables.composeProjectName = dockerComposeFile.name ?? null;

  const composeFilePath = writeComposeFile(mergedComposeFiles, dockerComposeFile);

  const dockerEventEmitter = createDockerEventEmitter(composeFilePath);

  mutables.runners = transformDockestServicesToRunners({
    dockerComposeFile,
    dockestServices,
    runMode,
    dockerEventEmitter,
  });

  mutables.dockerEventEmitter = dockerEventEmitter;

  configureLogger(mutables.runners);
};
