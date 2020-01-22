import { ConfigurationError } from '../../Errors'
import { RunnersObj } from '../../@types'

export const validateRunners = (runners: RunnersObj) => {
  if (Object.values(runners).length === 0) {
    throw new ConfigurationError('Failed to create at least one runner without dependencies')
  }
}
