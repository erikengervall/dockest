import net from 'net';
import { from, of, race } from 'rxjs';
import { concatMap, delay, ignoreElements, map, mergeMap, retryWhen, skipWhile, takeWhile, tap } from 'rxjs/operators';
import { Runner } from '../../@types';
import { DockestError } from '../../errors';

export type AcquireConnectionFunctionType = ({ host, port }: { host: string; port: number }) => Promise<void>;

const LOG_PREFIX = '[Check Connection]';
const RETRY_COUNT = 10;

const CONNECTION_TIMEOUT_MS = 1000;

export const acquireConnection: AcquireConnectionFunctionType = ({ host, port }): Promise<void> => {
  return new Promise((resolve, reject) => {
    const netSocket = net.createConnection({ host, port });

    const timeoutId = setTimeout(() => {
      netSocket.destroy();
      reject(new Error('Timeout while acquiring connection'));
    }, CONNECTION_TIMEOUT_MS);

    netSocket
      .once('connect', () => {
        clearTimeout(timeoutId);
        netSocket.end();
        resolve();
      })
      // Without a listener, a refused connection is an uncaught exception instead of a retry
      .once('error', (error) => {
        clearTimeout(timeoutId);
        netSocket.destroy();
        reject(error);
      });
  });
};

const checkPortConnection = ({
  host,
  port,
  runner,
  acquireConnection,
}: {
  host: string;
  port: number;
  runner: Runner;
  acquireConnection: AcquireConnectionFunctionType;
}) => {
  return of({ host, port }).pipe(
    // run check
    mergeMap(({ host, port }) => {
      return from(acquireConnection({ host, port }));
    }),
    tap(() => runner.logger.debug(`${LOG_PREFIX} ${host}:${port} connected`)),

    // retry if check errors
    retryWhen((errors) => {
      let retries = 0;

      return errors.pipe(
        tap((value) => {
          retries = retries + 1;
          runner.logger.warn(
            `${LOG_PREFIX} ${host}:${port} not reachable (attempt ${retries}/${RETRY_COUNT}): ${value.message}`,
          );
        }),
        takeWhile(() => {
          if (retries < RETRY_COUNT) {
            return true;
          }

          throw new DockestError(`${LOG_PREFIX} Timed out`, { runner });
        }),
        delay(1000),
      );
    }),
  );
};

export const createCheckConnection =
  ({ acquireConnection }: { acquireConnection: AcquireConnectionFunctionType }) =>
  async ({
    runner,
    runner: {
      dockerComposeFileService: { ports },
      host: runnerHost,
      isBridgeNetworkMode,
      dockerEventStream$,
    },
  }: {
    runner: Runner;
  }) => {
    const host = runnerHost || 'localhost';
    const portKey = isBridgeNetworkMode ? 'target' : 'published';
    // A port without a published host port gets a random one from Docker, which cannot be checked from here
    const portsToCheck = (ports || [])
      .map((portMapping) => portMapping[portKey])
      .filter((port): port is number => typeof port === 'number');
    if (portsToCheck.length === 0) {
      runner.logger.debug(`${LOG_PREFIX} Skip connection check as there are no ports exposed.`);
      return;
    }

    return race(
      dockerEventStream$.pipe(
        skipWhile((event) => event.action !== 'die' && event.action !== 'kill'),
        map((event) => {
          throw new DockestError('Container unexpectedly died.', { event });
        }),
      ),
      of(...portsToCheck).pipe(
        // concatMap -> run checks for each port in sequence
        concatMap((port) => {
          return checkPortConnection({
            runner,
            host,
            port,
            acquireConnection,
          });
        }),
        // we do not care about the single elements, we only want this stream to complete without errors.
        ignoreElements(),
      ),
    ).toPromise();
  };

export const checkConnection = createCheckConnection({ acquireConnection });
