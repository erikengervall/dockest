import { DockestConfig } from '../index'
import dumpError from '../utils/dumpError'

export default class BaseError extends Error {
  public static DockestConfig: DockestConfig

  public constructor(message: string, payload?: object) {
    let errorMessage = `💥 ${message}`
    if (payload) {
      errorMessage = `${errorMessage}\n${JSON.stringify(payload, null, 2)}`
    }

    super(`${errorMessage}`)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseError)
    }

    if (process.env.NODE_ENV !== 'test' && BaseError.DockestConfig.opts.dumpErrors === true) {
      dumpError({
        message: this.message,
        stack: this.stack,
        timestamp: new Date(),
        __configuration: BaseError.DockestConfig,
      })
    }
  }
}
