import { createWriteStream, WriteStream } from 'fs'
import { join } from 'path'
import execa from 'execa' /* eslint-disable-line import/default */
import { DockestError } from '../Errors'
import { Logger } from '../Logger'
import { GENERATED_COMPOSE_FILE_PATH } from '../constants'

export type LogWriterModeType = 'per-service' | 'aggregate' | 'pipe-stdout'

const DEFAULT_LOG_SYMBOL = Symbol('DEFAULT_LOG')

export type LogWriter = {
  register: (serviceName: string, containerId: string) => void
}

export const createLogWriter = ({
  mode,
  logPath,
  serviceNameFilter,
}: {
  mode: LogWriterModeType[]
  logPath: string
  serviceNameFilter?: string[]
}) => {
  const writeStreamMap = new Map<string | symbol, WriteStream>()

  if (mode.includes('aggregate')) {
    const writeStream = createWriteStream(join(logPath, `dockest.log`))
    writeStreamMap.set(DEFAULT_LOG_SYMBOL, writeStream)
  }

  const getDefaultWriteStream = () => {
    const stream = writeStreamMap.get(DEFAULT_LOG_SYMBOL)
    if (!stream) {
      throw new DockestError('Could not find default log stream.')
    }
    return stream
  }

  const createOrGetFileStream = (serviceName: string) => {
    let stream = writeStreamMap.get(serviceName)
    if (!stream) {
      stream = createWriteStream(join(logPath, `${serviceName}.dockest.log`))
      writeStreamMap.set(serviceName, stream)
    }
    return stream
  }

  const getWriteStream = (serviceName: string) => {
    return createOrGetFileStream(serviceName)
  }

  const register = (serviceName: string, containerId: string) => {
    if (serviceNameFilter && serviceNameFilter.includes(serviceName) === false) {
      Logger.debug(`Skip log collection for service ${serviceName} with containerId: ${containerId}.`)
      return
    }

    Logger.debug(`Registering log collection for ${serviceName} with containerId: ${containerId}`)

    const logCollectionProcess = execa(`docker-compose`, [
      '-f',
      GENERATED_COMPOSE_FILE_PATH,
      'logs',
      '-f',
      '--no-color',
      serviceName,
    ])

    if (!logCollectionProcess.stdout) {
      throw new DockestError('Process has no stdout.')
    }
    if (mode.includes('pipe-stdout')) {
      logCollectionProcess.stdout.pipe(process.stdout)
    }
    if (mode.includes('per-service')) {
      const writeStream = getWriteStream(serviceName)
      logCollectionProcess.stdout.pipe(writeStream)
    }
    if (mode.includes('aggregate')) {
      const writeStream = getDefaultWriteStream()
      logCollectionProcess.stdout.pipe(writeStream)
    }

    // execa returns a lazy promise.
    logCollectionProcess.then(() => undefined)
  }

  return {
    register,
  }
}
