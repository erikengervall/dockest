// tslint:disable:no-console

import { COLORS, ICONS } from '../constants'

const { LOADING, SUCCESS, INFO, VERBOSE, FAILED } = ICONS
const {
  BG: { WHITE },
  FG: { BLACK, RED },
  MISC: { RESET, BRIGHT },
} = COLORS

type logMethod = (message: string, logData?: object) => void

class BaseLogger {
  private static baseLoggerInstance: BaseLogger

  constructor() {
    if (BaseLogger.baseLoggerInstance) {
      return BaseLogger.baseLoggerInstance
    }

    BaseLogger.baseLoggerInstance = this
  }

  public logSuccess: logMethod = (m, d) => {
    console.log(`${SUCCESS} ${BRIGHT}${m}${RESET}`, this.defaultD(d), `\n`)
  }
  public logLoading: logMethod = (m, d) => {
    console.log(`${LOADING} ${BRIGHT}${m}${RESET}`, this.defaultD(d))
  }
  public logInfo: logMethod = (m, d) => {
    console.log(`${INFO} ${BRIGHT}${m}${RESET}`, this.defaultD(d))
  }
  public logVerbose: logMethod = (m, d) => {
    console.log(`${VERBOSE} ${WHITE}${BLACK}${m}${RESET}`, this.defaultD(d))
  }
  public logError: logMethod = (m, d) => {
    console.log(`${FAILED} ${RED}${m}${RESET}`, this.defaultD(d), '\n')
  }

  private defaultD = (d?: object): object | string => d || ''
}

export { logMethod }
export default BaseLogger
