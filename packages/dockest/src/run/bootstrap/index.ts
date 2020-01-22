import { configureLogger } from './configureLogger'
import { createRunners } from './createRunners'
import { injectDependees } from './injectDependees'
import { mergeComposeFiles } from './mergeComposeFiles'
import { parseComposeFile } from './parseComposeFile'
import { setupExitHandler } from './setupExitHandler'
import { validateRunners } from './validateRunners'
import { validateRunnersWithDependsOn } from './validateRunnersWithDependsOn'
import { writeComposeFile } from './writeComposeFile'
import { DockestConfig } from '../../@types'

export const bootstrap = async (config: DockestConfig) => {
  setupExitHandler(config)

  const { mergedComposeFiles } = await mergeComposeFiles(config)
  const { composeFileAsObject } = parseComposeFile(mergedComposeFiles)
  writeComposeFile(mergedComposeFiles, composeFileAsObject)

  const { runners, runnersWithDependsOn } = createRunners(config, composeFileAsObject)
  validateRunners(runners)
  validateRunnersWithDependsOn(runnersWithDependsOn)
  injectDependees(runners, runnersWithDependsOn)
  config.$.runners = runners

  configureLogger(config)
}
