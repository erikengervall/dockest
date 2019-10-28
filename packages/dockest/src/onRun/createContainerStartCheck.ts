import { interval, Subject, race } from 'rxjs'
import { takeUntil, tap, first, mapTo } from 'rxjs/operators'
import { ServiceDockerEventStream } from './createServiceDockerEventStream'
import { Runner } from '../runners/@types'

export const createContainerStartCheck = (runner: Runner, eventStream$: ServiceDockerEventStream) => {
  const stop$ = new Subject()

  const cancel$ = new Subject()

  const info$ = interval(1000).pipe(
    takeUntil(stop$),
    tap(() => {
      runner.logger.info('Still waiting for start event...')
    }),
  )

  const containerStarts$ = eventStream$.pipe(
    takeUntil(stop$),
    first(event => event.action === 'start'),
  )

  return {
    service: runner.runnerConfig.service,
    done: race(containerStarts$, info$, cancel$)
      .pipe(
        tap({
          next: () => {
            stop$.next()
            stop$.complete()
          },
        }),
        mapTo(undefined),
      )
      .toPromise(),
    cancel: () => {
      cancel$.complete()
    },
  }
}
