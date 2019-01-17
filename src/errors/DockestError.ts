import { ICONS } from '../constants'

export class DockestError extends Error {
  payload: object
  timestamp: Date

  constructor(message: string, payload: object = {}) {
    super(`${ICONS.ERROR} ${message}`)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DockestError)
    }

    this.payload = payload
    this.timestamp = new Date()
  }
}

export default DockestError
