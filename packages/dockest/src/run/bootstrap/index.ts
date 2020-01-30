import { configureLogger } from './configureLogger'
import { getParsedComposeFile } from './getParsedComposeFile'
import { mergeComposeFiles } from './mergeComposeFiles'
import { setupExitHandler } from './setupExitHandler'
import { transformDockestServicesToRunners } from './transformDockestServicesToRunners'
import { writeComposeFile } from './writeComposeFile'
import { DockestConfig, DockestService } from '../../@types'

export const bootstrap = async ({
  composeFile,
  dockestServices,
  dumpErrors,
  exitHandler,
  isInsideDockerContainer,
  mutables,
  perfStart,
}: {
  composeFile: DockestConfig['composeFile']
  dockestServices: DockestService[]
  dumpErrors: DockestConfig['dumpErrors']
  exitHandler: DockestConfig['exitHandler']
  isInsideDockerContainer: DockestConfig['isInsideDockerContainer']
  mutables: DockestConfig['mutables']
  perfStart: DockestConfig['perfStart']
}) => {
  setupExitHandler({ dumpErrors, exitHandler, mutables, perfStart })

  const { mergedComposeFiles } = await mergeComposeFiles({ composeFile })
  const { dockerComposeFile } = getParsedComposeFile(mergedComposeFiles)
  writeComposeFile(mergedComposeFiles, dockerComposeFile)

  mutables.runners = transformDockestServicesToRunners({ dockerComposeFile, dockestServices, isInsideDockerContainer })

  configureLogger(mutables.runners)
}
