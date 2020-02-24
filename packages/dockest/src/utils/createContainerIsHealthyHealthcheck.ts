import { tap, takeWhile, take, mapTo } from 'rxjs/operators'
import { Healthcheck } from '../@types'

export const createContainerIsHealthyHealthcheck: Healthcheck = ({ dockerEventStream$ }) =>
  dockerEventStream$
    .pipe(
      tap(ev => {
        if (ev.action === 'die' || ev.action === 'kill') {
          throw new Error('Container unexpectedly died.')
        }
      }),
      takeWhile(ev => ev.action === 'health_status' && ev.attributes.healthStatus === 'healthy'),
      mapTo(undefined),
      // complete stream (promise) after first successful health_status event was emitted.
      take(1),
    )
    .toPromise()
