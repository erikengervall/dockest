import { from, of } from 'rxjs'
import { delay, mergeMap, retryWhen, takeWhile, tap } from 'rxjs/operators'
import { ReadinessCheck } from '../@types'
import { DockestError } from '../_errors'

const LOG_PREFIX = '[Readiness Retry]'

/**
 * Retry a readiness check for the specified amount before failing/succeeding.
 */
export const withRetry = (
  input: ReadinessCheck,
  opts: {
    retryCount: number
  },
): ReadinessCheck => args =>
  of(input).pipe(
    tap(() => args.runner.logger.debug(`${LOG_PREFIX} Retry is enabled with ${opts.retryCount}`)),
    mergeMap(readinessCheck => from(readinessCheck(args))),
    retryWhen(errors => {
      let retries = 0

      return errors.pipe(
        tap(() => {
          retries = retries + 1
          args.runner.logger.debug(`${LOG_PREFIX} Timeout after ${opts.retryCount - retries} retries.`)
        }),
        takeWhile(() => {
          if (retries < opts.retryCount) return true
          throw new DockestError(`${LOG_PREFIX} Timed out`, { runner: args.runner })
        }),
        delay(1000),
      )
    }),
  )
