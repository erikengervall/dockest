import { default as fsLib } from 'fs'
import { default as yamlLib } from 'js-yaml'
import { mergeDeepRight } from 'ramda'
import createComposeObjFromComposeFile from './createComposeObjFromComposeFile'
import createComposeObjFromRunners from './createComposeObjFromRunners'
import transformComposeObjToRunners from './transformComposeObjToRunners'
import { DockestConfig } from '../../index'
import { GENERATED_COMPOSE_FILE_PATH } from '../../constants'

export default (config: DockestConfig, yaml = yamlLib, fs = fsLib) => {
  const composeObjFromComposeFile = createComposeObjFromComposeFile(config)
  const composeObjFromRunners = createComposeObjFromRunners(config)

  const composeObj = mergeDeepRight(composeObjFromComposeFile, composeObjFromRunners)
  config.runners = transformComposeObjToRunners(config, composeObj)

  fs.writeFileSync(GENERATED_COMPOSE_FILE_PATH, yaml.safeDump(composeObj))
}
