import { race, of, from } from 'rxjs'
import { skipWhile, map, mergeMap, tap, retryWhen, delay, takeWhile } from 'rxjs/operators'
import { createDefaultReadinessChecks } from '../../utils/createDefaultReadinessChecks'
import { DockestError } from '../../Errors'
import { Runner, DockestConfig } from '../../@types'

const LOG_PREFIX = '[Run ReadinessCheck]'

export const runReadinessCheck = async ({
  runner,
  runner: { containerId, dockerComposeFileService, readinessCheck, logger, dockerEventStream$ },
  readinessRetryCount,
}: {
  runner: Runner
  readinessRetryCount: DockestConfig['readinessRetryCount']
}) =>
  race(
    dockerEventStream$.pipe(
      skipWhile(ev => ev.action !== 'die' && ev.action !== 'kill'),
      map(event => {
        throw new DockestError('Container unexpectedly died.', { event })
      }),
    ),
    of(readinessCheck).pipe(
      tap(() => logger.debug(`${LOG_PREFIX} Starting`)),
      mergeMap(readinessCheck =>
        from(
          readinessCheck({
            containerId,
            defaultReadinessChecks: createDefaultReadinessChecks({ runner }),
            dockerComposeFileService,
            logger,
            dockerEventStream$,
          }),
        ),
      ),
      retryWhen(errors => {
        let retries = 0

        return errors.pipe(
          tap(() => {
            retries = retries + 1
            logger.debug(`${LOG_PREFIX} Timeout in ${readinessRetryCount - retries}s`)
          }),
          takeWhile(() => {
            if (retries < readinessRetryCount) return true

            throw new DockestError(`${LOG_PREFIX} Timed out`, { runner })
          }),
          delay(1000),
        )
      }),
      tap(() => {
        logger.info(`${LOG_PREFIX} Success`, { success: true })
      }),
    ),
  ).toPromise()
