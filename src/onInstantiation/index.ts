import { DockestConfig } from '../index'
import flattenRunners from './flattenRunners'
import generateComposeFile from './generateComposeFile'
import setupExitHandler from './setupExitHandler'

const onInstantiation = (config: DockestConfig) => {
  flattenRunners(config)
  setupExitHandler(config)
  generateComposeFile(config)
}

export default onInstantiation
