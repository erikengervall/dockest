import { ICONS } from '../constants'

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(`${ICONS.ERROR} Invalid configuration: ${message}}`)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConfigurationError)
    }
  }
}

export default ConfigurationError
