import { Runner, DockestConfig } from './@types'
import { DockerEventType } from './run/bootstrap/createDockerEventEmitter'

export interface Payload {
  runner?: Runner
  error?: Error | string
  event?: DockerEventType
}

export class BaseError extends Error {
  public static DockestConfig: DockestConfig
  public payload: Payload

  public constructor(message: string, payload: Payload = {}) {
    super(message)
    this.payload = payload

    if (Error.captureStackTrace) {
      // Maintains proper stack trace for where our error was thrown (only available on V8)
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
