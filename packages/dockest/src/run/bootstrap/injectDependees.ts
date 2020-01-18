import { ConfigurationError } from '../../Errors'
import { Runner } from '../../@types'

export const injectDependees = (runners: { [key: string]: Runner }, runnersWithDependsOn: Runner[]) =>
  runnersWithDependsOn.forEach(runnerWithDependsOn => {
    const {
      dockestService: { dependsOn = [] },
    } = runnerWithDependsOn

    dependsOn.forEach(dependencyServiceName => {
      const dependencyRunner = runners[dependencyServiceName]
      if (!dependencyRunner) {
        throw new ConfigurationError(`Unable to create dependency for runner with serviceName ${dependencyServiceName}`)
      }

      dependencyRunner.dependees.push(runnerWithDependsOn)
    })
  })
