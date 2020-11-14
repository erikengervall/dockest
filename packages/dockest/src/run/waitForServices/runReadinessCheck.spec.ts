import { ReplaySubject } from 'rxjs'
import { runReadinessCheck } from './runReadinessCheck'
import { createRunner } from '../../test-utils'

// mock delays to tick immediately
jest.mock('rxjs/operators', () => {
  const operators = jest.requireActual('rxjs/operators')
  operators.delay = jest.fn(() => (s: unknown) => s) // <= mock delay
  return operators
})

it('fails when the die event is emitted', async done => {
  const dockerEventStream$ = new ReplaySubject()
  dockerEventStream$.next({ action: 'die' })
  const runner = createRunner({ dockerEventStream$ } as any)

  return runReadinessCheck({ runner, readinessRetryCount: 30 })
    .then(() => done.fail('Should have thrown an error.'))
    .catch(err => {
      expect(err.message).toMatchInlineSnapshot(`"Container unexpectedly died."`)
      done()
    })
})

it('fails when the kill event is emitted', async done => {
  const dockerEventStream$ = new ReplaySubject()
  dockerEventStream$.next({ action: 'kill' })
  const runner = createRunner({ dockerEventStream$ } as any)

  return runReadinessCheck({ runner, readinessRetryCount: 30 })
    .then(() => done.fail('Should have thrown an error.'))
    .catch(err => {
      expect(err.message).toMatchInlineSnapshot(`"Container unexpectedly died."`)
      done()
    })
})

it('fails in case the readiness rejects', async done => {
  const runner = createRunner({ readinessCheck: () => Promise.reject('ReadinessCheck failed.') })

  return runReadinessCheck({ runner, readinessRetryCount: 30 })
    .then(() => done.fail('Should have thrown an error.'))
    .catch(err => {
      expect(err.message).toMatchInlineSnapshot(`"[Run ReadinessCheck] Timed out"`)
      done()
    })
})

it('succeeds in case the readinessCheck succeeds', async () => {
  const runner = createRunner({ readinessCheck: () => Promise.resolve() })

  const result = await runReadinessCheck({ runner, readinessRetryCount: 30 })

  expect(result).toEqual(undefined)
})
