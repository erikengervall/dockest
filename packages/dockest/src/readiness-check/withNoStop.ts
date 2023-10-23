import { from, race } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { ReadinessCheck } from '../@types'
import { DockestError } from '../_errors'
import { isDieEvent, isKillEvent } from '../run/bootstrap/createDockerEventEmitter'

/**
 * The wrapped readiness check will fail if the container dies or gets killed.
 */
export const withNoStop = (input: ReadinessCheck): ReadinessCheck => args =>
  race(
    from(input(args)),
    args.runner.dockerEventStream$.pipe(
      filter(ev => isDieEvent(ev) || isKillEvent(ev)),
      map(event => {
        throw new DockestError('Container unexpectedly died.', { runner: args.runner, event })
      }),
    ),
  )
