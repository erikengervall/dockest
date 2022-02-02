import { configureLogger } from './configureLogger'
import { getParsedComposeFile } from './getParsedComposeFile'
import { mergeComposeFiles } from './mergeComposeFiles'
import { setupExitHandler } from './setupExitHandler'
import { transformDockestServicesToRunners } from './transformDockestServicesToRunners'
import { writeComposeFile } from './writeComposeFile'
import { createDockerEventEmitter } from './createDockerEventEmitter'
import { getComposeFilesWithVersion } from './getComposeFilesWithVersion'
import { DockestConfig, DockestService } from '../../@types'

export const bootstrap = async ({
  composeFile,
  dockestServices,
  dumpErrors,
  exitHandler,
  runMode,
  mutables,
  perfStart,
}: {
  composeFile: DockestConfig['composeFile']
  dockestServices: DockestService[]
  dumpErrors: DockestConfig['dumpErrors']
  exitHandler: DockestConfig['exitHandler']
  runMode: DockestConfig['runMode']
  mutables: DockestConfig['mutables']
  perfStart: DockestConfig['perfStart']
}) => {
  setupExitHandler({ dumpErrors, exitHandler, mutables, perfStart })

  const { mergedComposeFiles } = await mergeComposeFiles(composeFile)

  const { dockerComposeFile } = getParsedComposeFile(mergedComposeFiles)

  const { dockerComposeFileWithVersion } = getComposeFilesWithVersion(composeFile, dockerComposeFile)

  const composeFilePath = writeComposeFile(mergedComposeFiles, dockerComposeFileWithVersion)

  const dockerEventEmitter = createDockerEventEmitter(composeFilePath)

  mutables.runners = transformDockestServicesToRunners({
    dockerComposeFile: dockerComposeFileWithVersion,
    dockestServices,
    runMode,
    dockerEventEmitter,
  })

  mutables.dockerEventEmitter = dockerEventEmitter

  configureLogger(mutables.runners)
}
