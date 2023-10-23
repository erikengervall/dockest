import { ReplaySubject } from 'rxjs';
import { AcquireConnectionFunctionType, createCheckConnection } from './check-connection';
import { createRunner } from '../../test-utils';

// mock delays to tick immediately
jest.mock('rxjs/operators', () => {
  const operators = jest.requireActual('rxjs/operators');
  operators.delay = jest.fn(() => (s: unknown) => s); // <= mock delay
  return operators;
});

const acquireConnection: AcquireConnectionFunctionType = () => Promise.resolve();
const checkConnection = createCheckConnection({ acquireConnection });

describe('happy', () => {
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
});

describe('errors', () => {
  it('fails when the die event is emitted', async () => {
    const dockerEventStream$ = new ReplaySubject();
    dockerEventStream$.next({ action: 'die' });
    const runner = createRunner({ dockerEventStream$ } as any);

    try {
      await checkConnection({ runner });
      expect(true).toEqual('Should have thrown an error.');
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`[DockestError: Container unexpectedly died.]`);
    }
  });

  it('fails when the kill event is emitted', async () => {
    const dockerEventStream$ = new ReplaySubject();
    dockerEventStream$.next({ action: 'kill' });
    const runner = createRunner({ dockerEventStream$ } as any);

    try {
      await checkConnection({ runner });
      expect(true).toEqual('Should have thrown an error.');
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`[DockestError: Container unexpectedly died.]`);
    }
  });

  it('fails when acquire connection times out', async () => {
    const acquireConnection: AcquireConnectionFunctionType = () => Promise.reject(new Error('Timeout'));
    const checkConnection = createCheckConnection({ acquireConnection });

    const runner = createRunner({});

    try {
      await checkConnection({ runner });
      expect(true).toEqual('Should have thrown an error.');
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`[DockestError: [Check Connection] Timed out]`);
    }
  });
});
