import BaseError from './BaseError'

class DockestError extends BaseError {
  constructor(message: string, payload: object = {}) {
    super(message, payload)
  }
}

export default DockestError
