// tslint:disable:no-console

import readline from 'readline'
import { COLORS, ICONS, LOG_LEVEL } from './constants'
import { Runner } from './runners/@types'

const { DEBUG, INFO, ERROR, WARN } = ICONS
const {
  FG: { RED, YELLOW },
  MISC: { RESET, BRIGHT },
} = COLORS

type LogMethod = (message: string, data?: { [key: string]: any }, service?: string) => void

const formatMessage = (message: string, service: string) =>
  `${service}${service && ': '}${message}${RESET}`

class Logger {
  public static logLevel: number = LOG_LEVEL.INFO

  public static error: LogMethod = (message, data = {}, service = '') => {
    if (Logger.logLevel >= LOG_LEVEL.ERROR) {
      const msg = formatMessage(message, service)
      console.error(`${ERROR}${RED} ${msg}`, data, '\n')
    }
  }

  public static warn: LogMethod = (message, data = {}, service = '') => {
    if (Logger.logLevel >= LOG_LEVEL.WARN) {
      const msg = formatMessage(message, service)
      console.warn(`${WARN}${YELLOW} ${msg}`, data, '\n')
    }
  }

  public static info: LogMethod = (message, data = {}, service = '') => {
    if (Logger.logLevel >= LOG_LEVEL.INFO) {
      const msg = formatMessage(message, service)
      console.info(`${INFO}${BRIGHT}  ${msg}`, data, '\n')
    }
  }

  public static debug: LogMethod = (message, data = {}, service = '') => {
    if (Logger.logLevel >= LOG_LEVEL.DEBUG) {
      const msg = formatMessage(message, service)
      console.debug(`${DEBUG}${BRIGHT}  ${msg}`, data, '\n')
    }
  }

  public static replacePrevLine = (m: string, isLast: boolean): void => {
    readline.cursorTo(process.stdout, 0)
    process.stdout.write(m)

    if (isLast) {
      process.stdout.write('\n\n')
    }
  }

  public static perf = (perfStart: number) => {
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

  private service: string = ''
  constructor(runner?: Runner) {
    this.service = runner ? runner.runnerConfig.service : ''
  }

  public error: LogMethod = (message, data) => Logger.error(message, data, this.service)
  public warn: LogMethod = (message, data) => Logger.warn(message, data, this.service)
  public info: LogMethod = (message, data) => Logger.info(message, data, this.service)
  public debug: LogMethod = (message, data) => Logger.debug(message, data, this.service)
}

export { LogMethod }
export default Logger
