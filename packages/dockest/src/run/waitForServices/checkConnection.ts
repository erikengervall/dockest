import net from 'net'
import { race, of, from } from 'rxjs'
import { concatMap, delay, ignoreElements, map, mergeMap, retryWhen, skipWhile, tap, takeWhile } from 'rxjs/operators'
import { DockestError } from '../../Errors'
import { Runner } from '../../@types'

export type AcquireConnectionFunctionType = ({ host, port }: { host: string; port: number }) => Promise<void>

const LOG_PREFIX = '[Check Connection]'
const RETRY_COUNT = 10

export const acquireConnection: AcquireConnectionFunctionType = ({ host, port }) =>
  new Promise((resolve, reject) => {
    let connected = false
    let timeoutId: NodeJS.Timeout | null = null

    const netSocket = net
      .createConnection({ host, port })
      .on('connect', () => {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        connected = true
        netSocket.end()
        resolve()
      })
      .on('error', () => {
        connected = false
      })

    timeoutId = setTimeout(() => !connected && reject(new Error('Timeout while acquiring connection')), 1000)
  })

const checkPortConnection = ({
  host,
  port,
  runner,
  acquireConnection,
}: {
  host: string
  port: number
  runner: Runner
  acquireConnection: AcquireConnectionFunctionType
}) =>
  of({ host, port }).pipe(
    // run check
    mergeMap(({ host, port }) => from(acquireConnection({ host, port }))),

    // retry if check errors
    retryWhen(errors => {
      let retries = 0

      return errors.pipe(
        tap(() => {
          retries = retries + 1
          runner.logger.debug(`${LOG_PREFIX} Timeout in ${RETRY_COUNT - retries}s (${host}:${port})`)
        }),
        takeWhile(() => {
          if (retries < RETRY_COUNT) {
            return true
          }

          throw new DockestError(`${LOG_PREFIX} Timed out`, { runner })
        }),
        delay(1000),
      )
    }),
  )

export const createCheckConnection = ({
  acquireConnection,
}: {
  acquireConnection: AcquireConnectionFunctionType
}) => async ({
  runner,
  runner: {
    dockerComposeFileService: { ports },
    host: runnerHost,
    isBridgeNetworkMode,
    dockerEventStream$,
  },
}: {
  runner: Runner
}) => {
  const host = runnerHost || 'localhost'
  const portKey = isBridgeNetworkMode ? 'target' : 'published'

  return race(
    dockerEventStream$.pipe(
      skipWhile(ev => ev.action !== 'die' && ev.action !== 'kill'),
      map(event => {
        throw new DockestError('Container unexpectedly died.', { event })
      }),
    ),
    of(...ports).pipe(
      // concatMap -> run checks for each port in sequence
      concatMap(({ [portKey]: port }) => checkPortConnection({ runner, host, port, acquireConnection })),
      // we do not care about the single elements, we only want this stream to complete without errors.
      ignoreElements(),
    ),
  ).toPromise()
}

export const checkConnection = createCheckConnection({ acquireConnection })
