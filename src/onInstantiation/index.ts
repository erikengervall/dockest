import { DockestConfig } from '../index'
import assignRunnerSymbol from './assignRunnerSymbol'
import generateComposeFile from './generateComposeFile'
import setLogLevel from './setLogLevel'
import setupExitHandler from './setupExitHandler'

const onInstantiation = (config: DockestConfig) => {
  setLogLevel(config)
  assignRunnerSymbol(config)
  setupExitHandler(config)
  generateComposeFile(config)
}

export default onInstantiation
