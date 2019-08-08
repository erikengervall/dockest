import validateTypes from './validateTypes'
import { RunnerConfig } from '../runners/@types'
import ConfigurationError from '../errors/ConfigurationError'

export default (schema: { [key: string]: any }, config: RunnerConfig) => {
  const failures = validateTypes(schema, config)

  if (failures.length > 0) {
    throw new ConfigurationError(`${failures.join('\n')}`)
  }
}
