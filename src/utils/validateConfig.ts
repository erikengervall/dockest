import validateTypes from './validateTypes'
import { RunnerConfig } from '../runners/@types'
import ConfigurationError from '../errors/ConfigurationError'

export default (schema: { [key: string]: any }, config: RunnerConfig) => {
  const failures = validateTypes(schema, config)

  const { build, image } = config
  if (!image && !build) {
    failures.push(`"image" and "build" are invalid, at least one has to be present. (image: ${image}, build: ${build})`)
  }

  if (failures.length > 0) {
    throw new ConfigurationError(`${failures.join('\n')}`)
  }
}
