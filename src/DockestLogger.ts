// tslint:disable:no-console

import { ICONS } from './constants'

type logMethod = (message: string, data?: object) => void

export class DockestLogger {
  private static instance: DockestLogger

  constructor() {
    if (DockestLogger.instance) {
      return DockestLogger.instance
    }

    DockestLogger.instance = this
  }

  info: logMethod = (message, data) => {
    console.info(`${message}`, data || '')
  }

  loading: logMethod = (message, data) => {
    console.info(`${ICONS.LOADING} ${message}`, data || '')
  }

  stop: logMethod = (message, data) => {
    console.info(`${ICONS.STOPPED} ${message}`, data || '')
  }

  success: logMethod = (message, data) => {
    console.info(`${ICONS.SUCCESS} ${message}`, data || '', '\n')
  }

  failed: logMethod = (message, data) => {
    console.error(`${ICONS.FAILED} ${message}`, data || '', '\n')
  }

  error: logMethod = (message, data) => {
    console.error(`${ICONS.ERROR} ${message}`, data || '', '\n')
  }
}

export default DockestLogger
