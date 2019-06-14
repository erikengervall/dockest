import { ConfigurationError } from '../errors'
import { RunnerConfig } from '../runners/index'
import { validateTypes } from './index'

const validateConfig = (schema: { [key: string]: any }, config: RunnerConfig) => {
  const failures = validateTypes(schema, config)

  if (failures.length > 0) {
    throw new ConfigurationError(`${failures.join('\n')}`)
  }
}

export default validateConfig
