import BaseError from './BaseError'

class DockestError extends BaseError {
  constructor(message: string, payload?: object) {
    super(message, payload)

    this.name = 'DockestError'
  }
}

export default DockestError
