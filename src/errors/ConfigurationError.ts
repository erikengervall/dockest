import BaseError from './BaseError'

export default class ConfigurationError extends BaseError {
  constructor(message: string, payload?: object) {
    super(message, payload)

    this.name = 'ConfigurationError'
  }
}
