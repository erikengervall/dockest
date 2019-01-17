// tslint:disable:no-console

import { ICONS } from './constants'

type logMethod = (message: string, data?: object | string) => void

interface ILogger {
  info: logMethod
  loading: logMethod
  stop: logMethod
  success: logMethod
  failed: logMethod
  error: logMethod
}

const logger: ILogger = {
  info: (message, data = '') => {
    console.info(`${message}`, data)
  },

  loading: (message, data = '') => {
    console.info(`${ICONS.LOADING} ${message}`, data)
  },

  stop: (message, data = '') => {
    console.info(`${ICONS.STOPPED} ${message}`, data)
  },

  success: (message, data = '') => {
    console.info(`${ICONS.SUCCESS} ${message}`, data, '\n')
  },

  failed: (message, data = '') => {
    console.error(`${ICONS.FAILED} ${message}`, data, '\n')
  },

  error: (message, data = '') => {
    console.error(`${ICONS.ERROR} ${message}`, data, '\n')
  },
}

export default logger
