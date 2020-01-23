import { ConfigurationError } from '../../Errors'
import { DockestConfig, DockerComposeFile, Runner, RunnersObj, DockestService } from '../../@types'
import { Logger } from '../../Logger'

export const transformDockestServicesToRunners = (config: DockestConfig, dockerComposeFile: DockerComposeFile) => {
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
    }

    if (config.$.isInsideDockerContainer) {
      runner.isBridgeNetworkMode = config.$.isInsideDockerContainer
      runner.host = serviceName
    }

    return runner
  }

  config.$.runners = config.$.dockestServices.reduce((acc: RunnersObj, dockestService) => {
    acc[dockestService.serviceName] = createRunner(dockestService)

    return acc
  }, {})
}
