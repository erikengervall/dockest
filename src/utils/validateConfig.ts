import ConfigurationError from '../errors/ConfigurationError'
import { RunnerConfig } from '../runners/@types'
import validateTypes from './validateTypes'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (schema: { [key: string]: any }, config: RunnerConfig) => {
  const failures = validateTypes(schema, config)

  if (failures.length > 0) {
    throw new ConfigurationError(`${failures.join('\n')}`)
  }
}
