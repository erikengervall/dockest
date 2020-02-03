import { interval, Subject, race } from 'rxjs'
import { takeUntil, tap, first, mapTo } from 'rxjs/operators'
import { Runner } from '../@types'

export const createContainerStartCheck = ({ runner }: { runner: Runner }) => {
  const { dockerEventStream$ } = runner
  const stop$ = new Subject()

  const cancel$ = new Subject()

  const info$ = interval(1000).pipe(
    takeUntil(stop$),
    tap(() => {
      runner.logger.info('Still waiting for start event...')
    }),
  )

  const containerStarts$ = dockerEventStream$.pipe(
    takeUntil(stop$),
    first(event => event.action === 'start'),
  )

  return {
    service: runner.serviceName,
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
