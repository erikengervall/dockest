import { ConfigurationError } from '../../Errors'
import { DockestConfig, DockerComposeFile, Runner } from '../../@types'
import { Logger } from '../../Logger'

export const createRunners = (config: DockestConfig, dockerComposeFile: DockerComposeFile) =>
  (config.$.runners = config.$.dockestServices.map(dockestService => {
    const dockerComposeFileService = dockerComposeFile.services[dockestService.serviceName]
    if (!dockerComposeFileService) {
      throw new ConfigurationError(
        `Unable to find compose service "${dockestService.serviceName}", make sure that the serviceName corresponds with your compose file's service`,
      )
    }

    const runner: Runner = {
      containerId: '',
      dockerComposeFileService,
      dockestService,
      logger: new Logger(dockestService.serviceName),
    }

    if (config.$.isInsideDockerContainer) {
      runner.isBridgeNetworkMode = config.$.isInsideDockerContainer
      runner.host = dockestService.serviceName
    }

    return runner
  }))
