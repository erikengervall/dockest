import { configureLogger } from './configureLogger'
import { mergeComposeFiles } from './mergeComposeFiles'
import { parseComposeFile } from './parseComposeFile'
import { setupExitHandler } from './setupExitHandler'
import { transformDockestServicesToRunners } from './transformDockestServicesToRunners'
import { writeComposeFile } from './writeComposeFile'
import { DockestConfig } from '../../@types'

export const bootstrap = async (config: DockestConfig) => {
  setupExitHandler(config)

  const { mergedComposeFiles } = await mergeComposeFiles(config)
  const { composeFileAsObject } = parseComposeFile(mergedComposeFiles)
  writeComposeFile(mergedComposeFiles, composeFileAsObject)

  transformDockestServicesToRunners(config, composeFileAsObject)

  configureLogger(config)
}
