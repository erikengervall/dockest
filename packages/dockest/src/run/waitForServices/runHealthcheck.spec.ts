import { ReplaySubject } from 'rxjs'
import { runHealthcheck } from './runHealthcheck'
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

  runHealthcheck({
    runner: runner,
  })
    .then(() => {
      done.fail('Should have thrown an error.')
    })
    .catch(err => {
      expect(err.message).toEqual('Container unexpectedly died.')
      done()
    })
})

it('fails when the kill event is emitted', async done => {
  const dockerEventStream$ = new ReplaySubject()

  dockerEventStream$.next({ action: 'kill' })

  const runner = createRunner({ dockerEventStream$ } as any)

  runHealthcheck({
    runner: runner,
  })
    .then(() => {
      done.fail('Should have thrown an error.')
    })
    .catch(err => {
      expect(err.message).toEqual('Container unexpectedly died.')
      done()
    })
})

it('fails in case the healthcheck rejects', async done => {
  const runner = createRunner({ healthcheck: () => Promise.reject('Healthcheck failed.') })

  runHealthcheck({
    runner,
  })
    .then(() => {
      done.fail('Should have thrown an error.')
    })
    .catch(err => {
      expect(err.message).toEqual('[Check Responsiveness] Timed out')
      done()
    })
})

it('succeeds in case the healthcheck succeeds', async () => {
  const runner = createRunner({ healthcheck: () => Promise.resolve() })
  const result = await runHealthcheck({ runner })
  expect(result).toEqual(undefined)
})
