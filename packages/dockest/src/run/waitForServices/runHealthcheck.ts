import { race, of, from } from 'rxjs'
import { skipWhile, map, mergeMap, tap, retryWhen, delay, takeWhile } from 'rxjs/operators'
import { createDefaultHealthchecks } from '../../utils/createDefaultHealthchecks'
import { DockestError } from '../../Errors'
import { Runner } from '../../@types'

const LOG_PREFIX = '[Run Healthcheck]'
const RETRY_COUNT = 30

export const runHealthcheck = async ({
  runner,
  runner: { containerId, dockerComposeFileService, healthcheck, logger, dockerEventStream$ },
}: {
  runner: Runner
}) =>
  race(
    dockerEventStream$.pipe(
      skipWhile(ev => ev.action !== 'die' && ev.action !== 'kill'),
      map(event => {
        throw new DockestError('Container unexpectedly died.', { event })
      }),
    ),
    of(healthcheck).pipe(
      tap(() => logger.debug(`${LOG_PREFIX}`)),
      mergeMap(healthcheck =>
        from(
          healthcheck({
            containerId,
            defaultHealthchecks: createDefaultHealthchecks({ runner }),
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
            logger.debug(`${LOG_PREFIX} Timeout in ${RETRY_COUNT - retries}s`)
          }),
          takeWhile(() => {
            if (retries < RETRY_COUNT) return true

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
