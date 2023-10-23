import { race } from 'rxjs'
import { filter, map, mapTo, take } from 'rxjs/operators'
import { ReadinessCheck } from '../@types'
import { DockestError } from '../_errors'
import { isDieEvent, isKillEvent } from '../run/bootstrap/createDockerEventEmitter'

/**
 * A readiness check that succeeds when the service exits with the exit code 0.
 */
export const zeroExitCodeReadinessCheck: ReadinessCheck = args =>
  race(
    args.runner.dockerEventStream$.pipe(
      filter(isDieEvent),
      map(event => {
        if (event.attributes.exitCode !== '0') {
          throw new DockestError(`Container exited with the wrong exit code '${event.attributes.exitCode}'.`, {
            runner: args.runner,
            event,
          })
        }
        return event
      }),
      mapTo(undefined),
      // complete stream (promise) after first successful health_status event was emitted.
      take(1),
    ),
    args.runner.dockerEventStream$.pipe(
      filter(isKillEvent),
      map(event => {
        throw new DockestError(`Received kill event.`, {
          runner: args.runner,
          event,
        })
      }),
    ),
  )
