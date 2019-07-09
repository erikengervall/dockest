import { DockestConfig } from '../index'
import generateComposeFile from './generateComposeFile'
import setupExitHandler from './setupExitHandler'

const onInstantiation = (config: DockestConfig) => {
  setupExitHandler(config)
  generateComposeFile(config)
}

export default onInstantiation
