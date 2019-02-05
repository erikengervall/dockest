// tslint:disable:no-console

import Dockest from '../'
import { COLORS, ICONS, LOG_LEVEL } from '../constants'

const { LOADING, SUCCESS, INFO, FAILED } = ICONS
const {
  FG: { RED },
  MISC: { RESET, BRIGHT },
} = COLORS

type logMethod = (message: string, logData?: any) => void

class BaseLogger {
  private static baseLoggerInstance: BaseLogger

  constructor() {
    return BaseLogger.baseLoggerInstance || (BaseLogger.baseLoggerInstance = this)
  }

  public IS_NOTHING = (): boolean => this.getLogLevel() >= LOG_LEVEL.NOTHING
  public IS_ERROR = (): boolean => this.getLogLevel() >= LOG_LEVEL.ERROR
  public IS_NORMAL = (): boolean => this.getLogLevel() >= LOG_LEVEL.NORMAL
  public IS_VERBOSE = (): boolean => this.getLogLevel() >= LOG_LEVEL.VERBOSE

  public trim = (str: any = ''): any =>
    typeof str === 'string' ? str.replace(/\s+/g, ' ').trim() : str

  public logSuccess: logMethod = (m, d) =>
    console.log(`${SUCCESS} ${BRIGHT}${m}${RESET}`, this.defaultD(d), `\n`)

  public logLoading: logMethod = (m, d) =>
    console.log(`${LOADING} ${BRIGHT}${m}${RESET}`, this.defaultD(d))

  public logInfo: logMethod = (m, d) =>
    console.log(`${INFO} ${BRIGHT}${m}${RESET}`, this.defaultD(d))

  public logError: logMethod = (m, d) =>
    console.log(`${FAILED} ${RED}${m}${RESET}`, this.defaultD(d), '\n')

  private getLogLevel = (): number => Dockest.config.dockest.logLevel
  private defaultD = (d?: object): object | string => d || ''
}

const baseLogger = new BaseLogger()
export { logMethod, baseLogger }
export default BaseLogger
