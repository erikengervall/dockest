import { ConfigurationError } from '../../Errors'
import { DockestConfig, DockerComposeFile, Runner, RunnersObj, DockestService } from '../../@types'
import { Logger } from '../../Logger'
import { DockerEventEmitter } from '../createDockerEventEmitter'
import { createDockerServiceEventStream } from '../createDockerServiceEventStream'

export const transformDockestServicesToRunners = ({
  dockerComposeFile,
  dockestServices,
  isInsideDockerContainer,
  dockerEventEmitter,
}: {
  dockerComposeFile: DockerComposeFile
  dockestServices: DockestService[]
  isInsideDockerContainer: DockestConfig['isInsideDockerContainer']
  dockerEventEmitter: DockerEventEmitter
}) => {
  const createRunner = (dockestService: DockestService) => {
    const { commands = [], dependents = [], healthcheck = () => Promise.resolve(), serviceName } = dockestService

    const dockerComposeFileService = dockerComposeFile.services[serviceName]
    if (!dockerComposeFileService) {
      throw new ConfigurationError(
        `Unable to find compose service "${serviceName}", make sure that the serviceName corresponds with your Compose File's service`,
      )
    }

    const runner: Runner = {
      commands,
      containerId: '',
      dependents: dependents.map(createRunner),
      dockerComposeFileService,
      healthcheck,
      logger: new Logger(serviceName),
      serviceName,
      dockerEventStream$: createDockerServiceEventStream(serviceName, dockerEventEmitter),
    }

    if (isInsideDockerContainer) {
      runner.host = serviceName
      runner.isBridgeNetworkMode = isInsideDockerContainer
    }

    return runner
  }

  return dockestServices.reduce((acc: RunnersObj, dockestService) => {
    acc[dockestService.serviceName] = createRunner(dockestService)

    return acc
  }, {})
}
