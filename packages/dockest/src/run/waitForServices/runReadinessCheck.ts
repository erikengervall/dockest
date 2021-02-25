import { race, of, from } from 'rxjs'
import { map, mergeMap, tap, retryWhen, delay, takeWhile, filter } from 'rxjs/operators'
import { createDefaultReadinessChecks } from '../../utils/createDefaultReadinessChecks'
import { DockestError } from '../../Errors'
import { Runner, DockestConfig } from '../../@types'
import { DockerEventType } from '../bootstrap/createDockerEventEmitter'

const LOG_PREFIX = '[Run ReadinessCheck]'

const isNonZeroExitCodeDieEvent = (event: DockerEventType) =>
  event.action === 'die' && event.attributes.exitCode !== '0'
const isKillEvent = (event: DockerEventType) => event.action === 'kill'

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
      filter(ev => ev.service === runner.serviceName && (isNonZeroExitCodeDieEvent(ev) || isKillEvent(ev))),
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
