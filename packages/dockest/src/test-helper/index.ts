import { DockerComposeFile, TestRunModeType } from '../@types'
import { DOCKEST_ATTACH_TO_PROCESS, DOCKEST_HOST_ADDRESS, DEFAULT_HOST_NAME } from '../constants'
import { DockestError } from '../Errors'
import { selectPortMapping } from '../utils/selectPortMapping'
import { getRunMode as _getRunMode } from '../utils/getRunMode'

let runMode: TestRunModeType | null = null

const getRunMode = (): TestRunModeType => {
  if (!runMode) {
    runMode = _getRunMode()
  }
  return runMode
}

const dockestConfig = process.env[DOCKEST_ATTACH_TO_PROCESS]

if (!dockestConfig) {
  throw new DockestError('Config not attached to process: Not executed inside dockest context')
}

const config: DockerComposeFile = JSON.parse(dockestConfig)

export const getHostAddress = () => {
  if (getRunMode() !== 'docker-injected-host-socket') {
    return DEFAULT_HOST_NAME
  }
  return DOCKEST_HOST_ADDRESS
}

export const resolveServiceAddress = (serviceName: string, targetPort: number | string) => {
  const service = config.services[serviceName]
  if (!service) {
    throw new DockestError(`Service "${serviceName}" does not exist`)
  }

  const portBinding = service.ports.map(selectPortMapping).find(portBinding => portBinding.target === targetPort)
  if (!portBinding) {
    throw new DockestError(`Service "${serviceName}" has no target port ${portBinding}`)
  }

  if (getRunMode() === 'docker-injected-host-socket') {
    return { host: serviceName, port: portBinding.target }
  }

  return { host: 'localhost', port: portBinding.published }
}

export const getServiceAddress = (serviceName: string, targetPort: number | string) => {
  const record = resolveServiceAddress(serviceName, targetPort)
  return `${record.host}:${record.port}`
}
