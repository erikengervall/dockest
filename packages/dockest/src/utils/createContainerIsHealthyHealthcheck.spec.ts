import { ReplaySubject } from 'rxjs'
import { createContainerIsHealthyHealthcheck } from './createContainerIsHealthyHealthcheck'
import { createRunner } from '../test-utils'

it('fails when the die event is emitted', async done => {
  const dockerEventsStream$ = new ReplaySubject()
  dockerEventsStream$.next({ action: 'kill' })
  const runner = createRunner({ dockerEventStream$: dockerEventsStream$ as any })
  await createContainerIsHealthyHealthcheck({ ...runner, defaultHealthchecks: {} as any })
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
  await createContainerIsHealthyHealthcheck({ ...runner, defaultHealthchecks: {} as any })
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
  const result = await createContainerIsHealthyHealthcheck({ ...runner, defaultHealthchecks: {} as any })
  expect(result).toEqual(undefined)
})
