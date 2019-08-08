import readline from 'readline'
import { LOG_LEVEL } from './constants'
import { Runner } from './runners/@types'

interface Payload {
  data?: { [key: string]: any }
  icon?: string
  nl?: number
  pnl?: number
  service?: string
  symbol?: string
  error?: Error
}

type LogMethod = (message: string, payload?: Payload) => void

const getLogArgs = (message: string, payload: Payload): string[] => {
  const { data, service, symbol, nl = 0, pnl = 0 } = payload
  let logArgs: string[] = []

  if (!!pnl && pnl > 0) {
    logArgs = logArgs.concat(new Array(pnl).fill('\n'))
  }

  const derivedService = service || 'Dockest'
  const derivedSymbol = symbol || '🌈'
  logArgs.push(`${derivedSymbol} ${derivedService} ${derivedSymbol} ${message}`)

  if (!!data && Logger.logLevel === LOG_LEVEL.DEBUG) {
    logArgs.push(JSON.stringify(data, null, 2))
  }

  if (!!nl && nl > 0) {
    logArgs = logArgs.concat(new Array(nl).fill('\n'))
  }

  return logArgs
}

class Logger {
  public static logLevel: number = LOG_LEVEL.INFO

  public static error: LogMethod = (message, payload = {}) => {
    if (Logger.logLevel >= LOG_LEVEL.ERROR) {
      console.error(...getLogArgs(message, payload)) // eslint-disable-line no-console
    }
  }

  public static warn: LogMethod = (message, payload = {}) => {
    if (Logger.logLevel >= LOG_LEVEL.WARN) {
      console.warn(...getLogArgs(message, payload)) // eslint-disable-line no-console
    }
  }

  public static info: LogMethod = (message, payload = {}) => {
    if (Logger.logLevel >= LOG_LEVEL.INFO) {
      console.info(...getLogArgs(message, payload)) // eslint-disable-line no-console
    }
  }

  public static debug: LogMethod = (message, payload = {}) => {
    if (Logger.logLevel >= LOG_LEVEL.DEBUG) {
      console.debug(...getLogArgs(message, payload)) // eslint-disable-line no-console
    }
  }

  public static replacePrevLine = (m: string, isLast: boolean = false): void => {
    readline.cursorTo(process.stdout, 0)
    process.stdout.write(m)

    if (isLast) {
      process.stdout.write('\n\n')
    }
  }

  public static perf = (perfStart: number): void => {
    const perfTime = Math.floor((Date.now() - perfStart) / 1000)
    let hours: number | string = Math.floor(perfTime / 3600)
    let minutes: number | string = Math.floor((perfTime - hours * 3600) / 60)
    let seconds: number | string = perfTime - hours * 3600 - minutes * 60

    if (hours < 10) {
      hours = `0${hours}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    if (seconds < 10) {
      seconds = `0${seconds}`
    }

    Logger.info(`Elapsed time: ${hours}:${minutes}:${seconds}`)
  }

  private runnerService: string = ''
  private runnerSymbol: string = '🦇 '
  public constructor(runner?: Runner) {
    this.runnerService = runner ? runner.runnerConfig.service : ''
  }

  public setRunnerSymbol = (symbol: string): void => {
    this.runnerSymbol = symbol
  }

  public error: LogMethod = (message, payload = {}) =>
    Logger.error(message, { ...payload, service: this.runnerService, symbol: this.runnerSymbol })

  public warn: LogMethod = (message, payload = {}) =>
    Logger.warn(message, { ...payload, service: this.runnerService, symbol: this.runnerSymbol })

  public info: LogMethod = (message, payload = {}) =>
    Logger.info(message, { ...payload, service: this.runnerService, symbol: this.runnerSymbol })

  public debug: LogMethod = (message, payload = {}) =>
    Logger.debug(message, { ...payload, service: this.runnerService, symbol: this.runnerSymbol })
}

export { LogMethod }
export default Logger
