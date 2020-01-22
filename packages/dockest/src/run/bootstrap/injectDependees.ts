import { ConfigurationError } from '../../Errors'
import { RunnersObj } from '../../@types'

export const injectDependees = (runners: RunnersObj, runnersWithDependsOn: RunnersObj) =>
  Object.values(runnersWithDependsOn).forEach(runnerWithDependsOn => {
    const {
      dockestService: { serviceName, dependsOn = '' },
    } = runnerWithDependsOn

    const runnerWithDependees = runners[dependsOn]
    if (!runnerWithDependees) {
      throw new ConfigurationError(`Failed to find dependency "${dependsOn}" for dependee runner "${serviceName}"`)
    }

    runnerWithDependees.dependees.push(runnerWithDependsOn)
  })
