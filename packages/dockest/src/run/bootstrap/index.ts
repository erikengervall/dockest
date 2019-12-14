import { configureLogger } from './configureLogger'
import { createRunners } from './createRunners'
import { mergeComposeFiles } from './mergeComposeFiles'
import { parseComposeFile } from './parseComposeFile'
import { setupExitHandler } from './setupExitHandler'
import { writeComposeFile } from './writeComposeFile'
import { DockestConfig } from '../../@types'

export const bootstrap = async (config: DockestConfig) => {
  const { mergedComposeFiles } = await mergeComposeFiles(config)
  const { composeFileAsObject } = parseComposeFile(mergedComposeFiles)
  writeComposeFile(mergedComposeFiles, composeFileAsObject)
  createRunners(config, composeFileAsObject)
  configureLogger(config)
  setupExitHandler(config)
}
