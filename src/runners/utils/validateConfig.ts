import { ConfigurationError } from '../../errors'
import { RunnerConfigs } from '../index'
import { validateTypes } from './index'

const validateConfig = (schema: { [key: string]: any }, config: RunnerConfigs) => {
  const failures = validateTypes(schema, config)

  if (failures.length > 0) {
    throw new ConfigurationError(`${failures.join('\n')}`)
  }
}

export default validateConfig
