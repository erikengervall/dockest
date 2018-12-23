import { ICONS } from '../constants'

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(`${ICONS.ERROR} Invalid configuration: ${message}}`)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConfigurationError)
    }
  }
}

export default ConfigurationError
