import BaseError from './BaseError'

class ConfigurationError extends BaseError {
  constructor(message: string, payload?: object) {
    super(message, payload)

    this.name = 'ConfigurationError'
  }
}

export default ConfigurationError
