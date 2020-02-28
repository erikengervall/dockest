import { ReplaySubject } from 'rxjs'
import { createContainerIsHealthyHealthcheck } from './createContainerIsHealthyHealthcheck'
import { createRunner } from '../test-utils'

it('fails when the die event is emitted', async done => {
  const dockerEventsStream$ = new ReplaySubject()
  const runner = createRunner({ dockerEventStream$: dockerEventsStream$ as any })

  dockerEventsStream$.next({ action: 'kill' })

  await createContainerIsHealthyHealthcheck({ ...runner, defaultReadinessChecks: {} as any })
    .then(() => {
      done.fail('Should throw.')
    })
    .catch(err => {
      expect(err.message).toEqual('Container unexpectedly died.')
      done()
    })
})

it('fails when the kill event is emitted', async done => {
  const dockerEventsStream$ = new ReplaySubject()
  dockerEventsStream$.next({ action: 'die' })
  const runner = createRunner({ dockerEventStream$: dockerEventsStream$ as any })
  await createContainerIsHealthyHealthcheck({ ...runner, defaultReadinessChecks: {} as any })
    .then(() => {
      done.fail('Should throw.')
    })
    .catch(err => {
      expect(err.message).toEqual('Container unexpectedly died.')
      done()
    })
})

it('succeeds when the health_status event is emitted', async () => {
  const dockerEventStream$ = new ReplaySubject()
  dockerEventStream$.next({ action: 'health_status', attributes: { healthStatus: 'healthy' } })
  const runner = createRunner({ dockerEventStream$: dockerEventStream$ as any })
  const result = await createContainerIsHealthyHealthcheck({ ...runner, defaultReadinessChecks: {} as any })
  expect(result).toEqual(undefined)
})

it('does not resolve in case a unhealthy event is emitted', async done => {
  const dockerEventStream$ = new ReplaySubject()
  const runner = createRunner({ dockerEventStream$: dockerEventStream$ as any })

  let healthCheckDidResolve = false

  createContainerIsHealthyHealthcheck({ ...runner, defaultReadinessChecks: {} as any })
    .then(result => {
      expect(result).toEqual(undefined)
      healthCheckDidResolve = true
    })
    .catch(err => {
      done.fail(err)
    })

  dockerEventStream$.next({ action: 'health_status', attributes: { healthStatus: 'unhealthy' } })

  runner.dockerEventStream$.subscribe(event => {
    if (event.action === 'health_status') {
      if (event.attributes.healthStatus === 'unhealthy') {
        expect(healthCheckDidResolve).toEqual(false)
        dockerEventStream$.next({ action: 'health_status', attributes: { healthStatus: 'healthy' } })
      } else if (event.attributes.healthStatus === 'healthy') {
        // defer so this check is run after the healthcheck promise did resolve
        Promise.resolve().then(() => {
          expect(healthCheckDidResolve).toEqual(true)
          done()
        })
      }
    } else {
      done.fail('Unexpected Event was emitted')
    }
  })
})
