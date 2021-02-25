import { from, race } from 'rxjs'
import { map, filter } from 'rxjs/operators'
import { ReadinessCheck } from '../@types'
import { DockestError } from '../Errors'
import { isDieEvent, isKillEvent } from '../run/bootstrap/createDockerEventEmitter'

/**
 * The wrapped readiness check will fail if the container dies or gets killed.
 */
export const withNoStop = (input: ReadinessCheck): ReadinessCheck => args =>
  race(
    from(input(args)),
    args.runner.dockerEventStream$.pipe(
      filter(ev => ev.service === args.runner.serviceName && (isDieEvent(ev) || isKillEvent(ev))),
      map(event => {
        throw new DockestError('Container unexpectedly died.', { runner: args.runner, event })
      }),
    ),
  )
