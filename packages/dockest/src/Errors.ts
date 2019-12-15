import { Runner, DockestConfig } from './@types'

export interface Payload {
  runner?: Runner
  error?: Error | string
}

export class BaseError extends Error {
  public static DockestConfig: DockestConfig
  public payload: Payload

  public constructor(message: string, payload: Payload = {}) {
    super(message)
    this.payload = payload

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseError)
    }
  }
}

export class DockestError extends BaseError {
  public constructor(message: string, payload?: Payload) {
    super(message, payload)

    this.name = 'DockestError'
  }
}

export class ConfigurationError extends BaseError {
  public constructor(message: string, payload?: Payload) {
    super(message, payload)

    this.name = 'ConfigurationError'
  }
}
