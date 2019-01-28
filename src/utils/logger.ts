// tslint:disable:no-console

import { COLORS, ICONS } from '../constants'
import Dockest from '../index'

const { VERBOSE, LOADING, SUCCESS, FAILED, ERROR } = ICONS
const {
  BG: { YELLOW: BG_Y },
  FG: { BLACK: FG_B, RED: FG_R },
  MISC: { RESET: M_R, BRIGHT: M_B },
} = COLORS

type logMethod = (message: string, logData?: object | string) => void

interface ILogger {
  loading: logMethod
  success: logMethod
  failed: logMethod
  error: logMethod
  command: logMethod
}

const trim = (str: string = ''): string => str.replace(/\s+/g, ' ').trim()

const handleLogData = (logData?: any) => {
  if (typeof logData === 'string') {
    return trim(logData)
  }

  return logData
}

const logger: ILogger = {
  command: (logData = '') => {
    if (Dockest.config.dockest.verbose) {
      console.info(`${VERBOSE} ${BG_Y}${FG_B} Ran command ${M_R}`, handleLogData(logData))
    }
  },

  loading: (message, logData = '') => {
    console.info(`${LOADING} ${M_B}${message}${M_R}`, logData)
  },

  success: (message, logData = '') => {
    console.info(`${SUCCESS} ${M_B}${message}${M_R}`, logData, '\n')
  },
  failed: (message, logData = '') => {
    console.info(`${FAILED} ${FG_R}${message}${M_R}`, logData, '\n')
  },
  error: (message, logData = '') => {
    console.info(`${ERROR} ${FG_R}${message}${M_R}`, logData, '\n')
  },
}

export default logger
