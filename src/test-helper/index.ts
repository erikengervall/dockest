/* eslint-disable import/default */
import isDocker from 'is-docker'
import { ComposeFile } from '../runners/@types'

const isInsideDockerContainer = isDocker()

if (!process.env.DOCKEST_INTERNAL_CONFIG) {
  throw new Error('Not executed inside dockest context.')
}

const config: ComposeFile = JSON.parse(process.env.DOCKEST_INTERNAL_CONFIG)

export const getHostAddress = () => {
  if (!isInsideDockerContainer) {
    return `host.docker.internal`
  }

  return `host.dockest-runner.internal`
}

export const getServiceAddress = (serviceName: string, targetPort: number | string) => {
  const service = config.services[serviceName]
  if (!service) {
    throw new Error(`Service "${serviceName}" does not exist.`)
  }
  const portBinding = service.ports.find(portBinding => portBinding.target === targetPort)
  if (!portBinding) {
    throw new Error(`Service "${serviceName}" has no target port ${portBinding}.`)
  }

  if (isInsideDockerContainer) {
    return `${serviceName}:${portBinding.target}`
  }
  return `localhost:${portBinding.published}`
}
