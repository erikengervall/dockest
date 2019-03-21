// tslint:disable:no-console

import { COLORS, ICONS, LOG_LEVEL } from '../constants'

const { LOADING, SUCCESS, INFO, FAILED } = ICONS
const {
  FG: { RED },
  MISC: { RESET, BRIGHT },
} = COLORS

type logMethod = (message: string, logData?: any) => void

class BaseLogger {
  // Due to Jest running in a node VM, the logLevel has to be defaulted
  public static logLevel: number = LOG_LEVEL.NORMAL
  public static runnerKey: string = ''
  private static baseLoggerInstance: BaseLogger

  constructor() {
    return BaseLogger.baseLoggerInstance || (BaseLogger.baseLoggerInstance = this)
  }

  public LOG_LEVEL_NOTHING = () => BaseLogger.logLevel >= LOG_LEVEL.NOTHING
  public LOG_LEVEL_ERROR = () => BaseLogger.logLevel >= LOG_LEVEL.ERROR
  public LOG_LEVEL_NORMAL = () => BaseLogger.logLevel >= LOG_LEVEL.NORMAL
  public LOG_LEVEL_VERBOSE = () => BaseLogger.logLevel >= LOG_LEVEL.VERBOSE

  public trim = (str: any = ''): any =>
    typeof str === 'string' ? str.replace(/\s+/g, ' ').trim() : str

  public logSuccess: logMethod = (m, d) =>
    console.log(`${SUCCESS} ${BRIGHT}${BaseLogger.runnerKey}${m}${RESET}`, this.defaultD(d), `\n`)

  public logLoading: logMethod = (m, d) =>
    console.log(`${LOADING} ${BRIGHT}${BaseLogger.runnerKey}${m}${RESET}`, this.defaultD(d))

  public logInfo: logMethod = (m, d) =>
    console.log(`${INFO}  ${BRIGHT}${BaseLogger.runnerKey}${m}${RESET}`, this.defaultD(d))

  public logError: logMethod = (m, d) =>
    console.log(`${FAILED} ${RED}${BaseLogger.runnerKey}${m}${RESET}`, this.defaultD(d), '\n')

  private defaultD = (d?: object): object | string => d || ''
}

export { logMethod }
export default BaseLogger
