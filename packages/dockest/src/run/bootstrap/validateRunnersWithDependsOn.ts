import { ConfigurationError } from '../../Errors'
import { RunnersObj } from '../../@types'

export const validateRunnersWithDependsOn = (runnersWithDependencies: RunnersObj) =>
  Object.values(runnersWithDependencies).some(({ dockestService: { dependsOn } }) => {
    if (dependsOn && runnersWithDependencies[dependsOn]) {
      throw new ConfigurationError('Multi-level dependencies is currently not supported')
    }
  })
