import { ReplaySubject } from 'rxjs'
import { runReadinessCheck } from './runReadinessCheck'
import { createRunner } from '../../test-utils'

// mock delays to tick immediately
jest.mock('rxjs/operators', () => {
  const operators = jest.requireActual('rxjs/operators')
  operators.delay = jest.fn(() => (s: unknown) => s) // <= mock delay
  return operators
})

it('fails when the die event is emitted with a non zero exit code', async done => {
  const dockerEventStream$ = new ReplaySubject()
  const runner = createRunner({ dockerEventStream$ } as any)
  dockerEventStream$.next({ service: runner.serviceName, action: 'die', attributes: { exitCode: '1' } })

  return runReadinessCheck({ runner, readinessRetryCount: 30 })
    .then(() => done.fail('Should have thrown an error.'))
    .catch(err => {
      expect(err.message).toMatchInlineSnapshot(`"Container unexpectedly died."`)
      done()
    })
})

it('does not fail if the die event is emitted with a zero exit code', async done => {
  const dockerEventStream$ = new ReplaySubject()
  const runner = createRunner({
    dockerEventStream$,
    readinessCheck: () => Promise.resolve(),
  } as any)
  dockerEventStream$.next({ service: runner.serviceName, action: 'die', attributes: { exitCode: '0' } })

  return runReadinessCheck({
    runner,
    readinessRetryCount: 30,
  })
    .then(() => done())
    .catch(err => {
      done.fail(err)
    })
})

it('fails when the kill event is emitted', async done => {
  const dockerEventStream$ = new ReplaySubject()
  const runner = createRunner({ dockerEventStream$ } as any)
  dockerEventStream$.next({ service: runner.serviceName, action: 'kill' })

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
