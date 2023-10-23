import { ReplaySubject } from 'rxjs';
import { createCheckConnection, AcquireConnectionFunctionType } from './checkConnection';
import { createRunner } from '../../test-utils';

// mock delays to tick immediately
jest.mock('rxjs/operators', () => {
  const operators = jest.requireActual('rxjs/operators');
  operators.delay = jest.fn(() => (s: unknown) => s); // <= mock delay
  return operators;
});

const acquireConnection: AcquireConnectionFunctionType = () => Promise.resolve();
const checkConnection = createCheckConnection({ acquireConnection });

it('fails when the die event is emitted', async done => {
  const dockerEventStream$ = new ReplaySubject();
  dockerEventStream$.next({ action: 'die' });
  const runner = createRunner({ dockerEventStream$ } as any);

  checkConnection({ runner })
    .then(() => done.fail('Should have thrown an error.'))
    .catch(err => {
      expect(err.message).toEqual('Container unexpectedly died.');
      done();
    });
});

it('fails when the kill event is emitted', async done => {
  const dockerEventStream$ = new ReplaySubject();
  dockerEventStream$.next({ action: 'kill' });
  const runner = createRunner({ dockerEventStream$ } as any);

  checkConnection({ runner })
    .then(() => done.fail('Should have thrown an error.'))
    .catch(err => {
      expect(err.message).toEqual('Container unexpectedly died.');
      done();
    });
});

it('succeeds with zero port checks', async () => {
  const dockerEventStream$ = new ReplaySubject() as any;
  const runner = createRunner({
    dockerEventStream$,
    dockerComposeFileService: { image: 'node:10-alpine', ports: [] },
  });

  const result = await checkConnection({ runner });

  expect(result).toEqual(undefined);
});

it('succeeds when the port check is successfull', async () => {
  const runner = createRunner({});

  const result = await checkConnection({ runner });

  expect(result).toEqual(undefined);
});

it('fails when acquire connection times out', async done => {
  const acquireConnection: AcquireConnectionFunctionType = () => Promise.reject(new Error('Timeout'));
  const checkConnection = createCheckConnection({ acquireConnection });

  const runner = createRunner({});

  await checkConnection({
    runner,
  })
    .then(() => {
      done.fail('Should have thrown an error.');
    })
    .catch(err => {
      expect(err.message).toEqual('[Check Connection] Timed out');
      done();
    });
});
