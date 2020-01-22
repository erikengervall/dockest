import { ConfigurationError } from '../../Errors'
import { DockestConfig, DockerComposeFile, Runner, RunnersObj } from '../../@types'
import { Logger } from '../../Logger'

interface Acc {
  runners: RunnersObj
  runnersWithDependsOn: RunnersObj
}

export const createRunners = (config: DockestConfig, dockerComposeFile: DockerComposeFile) =>
  config.$.dockestServices.reduce(
    (acc: Acc, dockestService) => {
      const { serviceName, dependsOn = [] } = dockestService

      const dockerComposeFileService = dockerComposeFile.services[serviceName]
      if (!dockerComposeFileService) {
        throw new ConfigurationError(
          `Unable to find compose service "${serviceName}", make sure that the serviceName corresponds with your Compose File's service`,
        )
      }

      const runner: Runner = {
        containerId: '',
        dependees: [],
        dockerComposeFileService,
        dockestService,
        logger: new Logger(serviceName),
      }

      if (config.$.isInsideDockerContainer) {
        runner.isBridgeNetworkMode = config.$.isInsideDockerContainer
        runner.host = serviceName
      }

      if (dependsOn.length > 0) {
        acc.runnersWithDependsOn[serviceName] = runner
      } else {
        acc.runners[serviceName] = runner
      }

      return acc
    },
    {
      runners: {},
      runnersWithDependsOn: {},
    },
  )
