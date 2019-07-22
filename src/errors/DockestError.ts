import BaseError from './BaseError'

export default class DockestError extends BaseError {
  public constructor(message: string, payload?: object) {
    super(message, payload)

    this.name = 'DockestError'
  }
}
