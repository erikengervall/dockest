import { configureLogger } from './configureLogger'
import { mergeComposeFiles } from './mergeComposeFiles'
import { parseComposeFile } from './parseComposeFile'
import { setupExitHandler } from './setupExitHandler'
import { transformDockestServicesToRunners } from './transformDockestServicesToRunners'
import { writeComposeFile } from './writeComposeFile'
import { DockestConfig, DockestService, GlobConfig } from '../../@types'

export const bootstrap = async ({
  composeFile,
  dockestServices,
  dumpErrors,
  exitHandler,
  glob,
  isInsideDockerContainer,
  perfStart,
}: {
  composeFile: DockestConfig['composeFile']
  dockestServices: DockestService[]
  dumpErrors: DockestConfig['dumpErrors']
  exitHandler: DockestConfig['exitHandler']
  glob: GlobConfig
  isInsideDockerContainer: DockestConfig['isInsideDockerContainer']
  perfStart: DockestConfig['perfStart']
}) => {
  setupExitHandler({
    dumpErrors,
    exitHandler,
    glob,
    perfStart,
  })

  const { mergedComposeFiles } = await mergeComposeFiles({ composeFile })
  const { composeFileAsObject } = parseComposeFile(mergedComposeFiles)
  writeComposeFile(mergedComposeFiles, composeFileAsObject)

  const runners = transformDockestServicesToRunners({
    dockerComposeFile: composeFileAsObject,
    dockestServices,
    isInsideDockerContainer,
  })

  glob.runners = runners

  configureLogger(runners)

  return runners
}
