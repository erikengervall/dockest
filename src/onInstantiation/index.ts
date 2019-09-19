import assignRunnerSymbol from './assignRunnerSymbol'
import generateComposeFile from './generateComposeFile'
import setLogLevel from './setLogLevel'
import setupExitHandler from './setupExitHandler'
import { DockestConfig } from '../index'

const onInstantiation = (config: DockestConfig) => {
  setLogLevel(config)
  generateComposeFile(config)
  assignRunnerSymbol(config)
  setupExitHandler(config)
}

export default onInstantiation
