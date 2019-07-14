import { ICONS } from '../constants'

export default class BaseError extends Error {
  public constructor(message: string, payload: object = {}) {
    super(`${ICONS.ERROR} ${message} \n${JSON.stringify(payload, null, 2)}`)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseError)
    }
  }
}
