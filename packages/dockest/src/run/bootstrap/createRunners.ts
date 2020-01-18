import { injectDependees } from './injectDependees'
import { ConfigurationError } from '../../Errors'
import { DockestConfig, DockerComposeFile, Runner } from '../../@types'
import { Logger } from '../../Logger'

export const createRunners = (config: DockestConfig, dockerComposeFile: DockerComposeFile) => {
  const { runners, runnersWithDependsOn } = config.$.dockestServices.reduce(
    (
      acc: {
        runners: { [key: string]: Runner }
        runnersWithDependsOn: Runner[]
      },
      dockestService,
    ) => {
      const { serviceName, dependsOn = [] } = dockestService

      const dockerComposeFileService = dockerComposeFile.services[serviceName]
      if (!dockerComposeFileService) {
        throw new ConfigurationError(
          `Unable to find compose service "${serviceName}", make sure that the serviceName corresponds with your compose file's service`,
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
        acc.runnersWithDependsOn.push(runner)
      } else {
        acc.runners[serviceName] = runner
      }

      return acc
    },
    {
      runners: {},
      runnersWithDependsOn: [],
    },
  )

  injectDependees(runners, runnersWithDependsOn)

  config.$.runners = runners
}
