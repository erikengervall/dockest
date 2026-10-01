import net from 'net';
import { ReplaySubject } from 'rxjs';
import {
  acquireConnection as acquireRealConnection,
  AcquireConnectionFunctionType,
  createCheckConnection,
} from './check-connection';
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
      dockerComposeFileService: { image: 'node:18-alpine', ports: [] },
    });

    const result = await checkConnection({ runner });

    expect(result).toEqual(undefined);
  });

  it('skips ports without a published host port', async () => {
    const acquireConnection = jest.fn(() => Promise.resolve());
    const runner = createRunner({ dockerComposeFileService: { image: 'node:18-alpine', ports: [{ target: 3000 }] } });

    await createCheckConnection({ acquireConnection })({ runner });

    expect(acquireConnection).not.toHaveBeenCalled();
  });

  it('succeeds when the port check is successfull', async () => {
    const runner = createRunner({});

    const result = await checkConnection({ runner });

    expect(result).toEqual(undefined);
  });
});

describe('sad', () => {
  it('fails when the die event is emitted', async () => {
    const dockerEventStream$ = new ReplaySubject();
    dockerEventStream$.next({ action: 'die' });
    const runner = createRunner({ dockerEventStream$ } as any);

    try {
      await checkConnection({ runner });
      expect(true).toEqual('Should throw.');
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
      expect(true).toEqual('Should throw.');
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
      expect(true).toEqual('Should throw.');
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`[DockestError: [Check Connection] Timed out]`);
    }
  });
});

describe('acquireConnection', () => {
  it('resolves once the port accepts connections', async () => {
    const server = net.createServer((socket) => socket.end());
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address() as net.AddressInfo;

    await expect(acquireRealConnection({ host: '127.0.0.1', port })).resolves.toBeUndefined();

    await new Promise((resolve) => server.close(resolve));
  });

  it('rejects instead of throwing when the connection is refused', async () => {
    const server = net.createServer();
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address() as net.AddressInfo;
    await new Promise((resolve) => server.close(resolve));

    await expect(acquireRealConnection({ host: '127.0.0.1', port })).rejects.toMatchObject({ code: 'ECONNREFUSED' });
  });
});
