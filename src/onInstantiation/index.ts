import { DockestConfig } from '..'
import flattenRunners from './flattenRunners'
import generateComposeFile from './generateComposeFile'
import setupExitHandler, { ErrorPayload } from './setupExitHandler'

const onInstantiation = (config: DockestConfig) => {
  flattenRunners(config)
  setupExitHandler(config)
  generateComposeFile(config)
}

export { ErrorPayload }
export default onInstantiation
