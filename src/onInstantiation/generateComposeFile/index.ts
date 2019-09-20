import { default as fsLib } from 'fs'
import { default as yamlLib } from 'js-yaml'
import createComposeObjFromComposeFile from './createComposeObjFromComposeFile'
import createComposeObjFromRunners from './createComposeObjFromRunners'
import transformComposeObjToRunners from './transformComposeObjToRunners'
import { DockestConfig } from '../../index'
import { GENERATED_COMPOSE_FILE_PATH, GENERATED_RUNNER_COMPOSE_FILE_PATH } from '../../constants'

export default (config: DockestConfig, yaml = yamlLib, fs = fsLib) => {
  // create runner config on fs
  const composeObjFromRunners = createComposeObjFromRunners(config)
  fs.writeFileSync(GENERATED_RUNNER_COMPOSE_FILE_PATH, yaml.safeDump(composeObjFromRunners))

  const configFiles = []
  if (config.opts.composeFile) {
    if (Array.isArray(config.opts.composeFile)) {
      configFiles.push(...config.opts.composeFile)
    } else {
      configFiles.push(config.opts.composeFile)
    }
  }
  configFiles.push(GENERATED_RUNNER_COMPOSE_FILE_PATH)

  // merge all config
  const composeObjFromComposeFile = createComposeObjFromComposeFile(configFiles)

  if (config.opts.guessRunnerType) {
    config.runners = transformComposeObjToRunners(config, composeObjFromComposeFile)
  }

  // write final config to fs
  fs.writeFileSync(GENERATED_COMPOSE_FILE_PATH, yaml.safeDump(composeObjFromComposeFile))
}
