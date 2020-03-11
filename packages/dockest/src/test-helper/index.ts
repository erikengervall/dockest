import isDocker from 'is-docker' // eslint-disable-line import/default
import { DockerComposeFile } from '../@types'
import { DOCKEST_ATTACH_TO_PROCESS, DOCKEST_HOST_ADDRESS, DEFAULT_HOST_NAME } from '../constants'
import { DockestError } from '../Errors'
import { selectPortMapping } from '../utils/selectPortMapping'

const isInsideDockerContainer = isDocker()
const dockestConfig = process.env[DOCKEST_ATTACH_TO_PROCESS]

if (!dockestConfig) {
  throw new DockestError('Config not attached to process: Not executed inside dockest context')
}

const config: DockerComposeFile = JSON.parse(dockestConfig)

export const getHostAddress = () => {
  if (!isInsideDockerContainer) {
    return DEFAULT_HOST_NAME
  }

  return DOCKEST_HOST_ADDRESS
}

export const getServiceAddress = (serviceName: string, targetPort: number | string) => {
  const service = config.services[serviceName]
  if (!service) {
    throw new DockestError(`Service "${serviceName}" does not exist`)
  }

  const portBinding = service.ports.map(selectPortMapping).find(portBinding => portBinding.target === targetPort)
  if (!portBinding) {
    throw new DockestError(`Service "${serviceName}" has no target port ${portBinding}`)
  }

  if (isInsideDockerContainer) {
    return `${serviceName}:${portBinding.target}`
  }

  return `localhost:${portBinding.published}`
}
