import BaseError from './BaseError'

class ConfigurationError extends BaseError {
  constructor(message: string) {
    super(`Invalid configuration: ${message}}`)
  }
}

export default ConfigurationError
