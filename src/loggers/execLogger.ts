// tslint:disable:no-console

import { LOG_LEVEL } from '../constants'
import Dockest from '../index'
import BaseLogger, { logMethod } from './baseLogger'

const logLevel = Dockest ? Dockest.config.dockest.logLevel : LOG_LEVEL.VERBOSE

const trim = (str: string = ''): string => str.replace(/\s+/g, ' ').trim()
const handleLogData = (logData?: any) => {
  if (typeof logData === 'string') {
    return trim(logData)
  }

  return logData
}

class ExecLogger extends BaseLogger {
  public shellCmd: logMethod = (logData = '') =>
    logLevel >= LOG_LEVEL.VERBOSE &&
    this.logVerbose(`Executed following shell script`, handleLogData(logData))

  public setup: logMethod = runnerKey => {
    if (logLevel >= LOG_LEVEL.NORMAL) {
      const topSeparator = new Array(runnerKey.length * 2).fill(`-`).join('')
      const bottomSeparator = new Array(runnerKey.length * 2).fill(`-`).join('')
      console.log(`
${topSeparator}\n\
${this.logLoading(`${runnerKey}: Setting up`)}\n\
${bottomSeparator}`)
    }
  }
  public setupSuccess: logMethod = runnerKey => {
    if (logLevel >= LOG_LEVEL.NORMAL) {
      const topSeparator = new Array(runnerKey.length * 2).fill(`/`).join('')
      const bottomSeparator = new Array(runnerKey.length * 2).fill(`/`).join('')
      console.log(`
${topSeparator}\n\
${this.logSuccess(`${runnerKey}: Setup successful`)}\n\
${bottomSeparator}`)
    }
  }
  public startContainer: logMethod = runnerKey => {
    if (logLevel >= LOG_LEVEL.NORMAL) {
      this.logLoading(`${runnerKey}: Starting container`)
    }
  }
  public startContainerSuccess: logMethod = runnerKey => {
    if (logLevel >= LOG_LEVEL.NORMAL) {
      this.logSuccess(`${runnerKey}: Container running`)
    }
  }

  checkHealth: logMethod = runnerKey => {
    if (logLevel >= LOG_LEVEL.NORMAL) {
      this.logLoading(`${runnerKey}: Healthchecking container`)
    }
  }
  checkHealthSuccess: logMethod = runnerKey => {
    if (logLevel >= LOG_LEVEL.NORMAL) {
      this.logSuccess(`${runnerKey}: Healthcheck successful`)
    }
  }
  checkResponsiveness = (runnerKey: string, timeout: number): void => {
    if (logLevel >= LOG_LEVEL.VERBOSE) {
      this.logLoading(`${runnerKey}: Checking container's responsiveness (Timeout in: ${timeout}s)`)
    }
  }
  checkResponsivenessSuccess: logMethod = runnerKey => {
    if (logLevel >= LOG_LEVEL.VERBOSE) {
      this.logSuccess(`${runnerKey}: Container's responsiveness checked`)
    }
  }
  checkConnection = (runnerKey: string, timeout: number): void => {
    if (logLevel >= LOG_LEVEL.VERBOSE) {
      this.logLoading(`${runnerKey}: Checking container's connection (Timeout in: ${timeout}s)`)
    }
  }
  checkConnectionSuccess: logMethod = runnerKey => {
    if (logLevel >= LOG_LEVEL.VERBOSE) {
      this.logSuccess(`${runnerKey}: Container's connection checked`)
    }
  }

  teardown: logMethod = runnerKey => {
    if (logLevel >= LOG_LEVEL.NORMAL) {
      this.logLoading(`${runnerKey}: Container being teared down`)
    }
  }
  teardownSuccess: logMethod = runnerKey => {
    if (logLevel >= LOG_LEVEL.NORMAL) {
      this.logSuccess(`${runnerKey}: Container teared down`)
    }
  }
  stopContainer: logMethod = runnerKey => {
    if (logLevel >= LOG_LEVEL.VERBOSE) {
      this.logLoading(`${runnerKey}: Container being stopped`)
    }
  }
  stopContainerSuccess: logMethod = runnerKey => {
    if (logLevel >= LOG_LEVEL.VERBOSE) {
      this.logSuccess(`${runnerKey}: Container stopped`)
    }
  }
  removeContainer: logMethod = runnerKey => {
    if (logLevel >= LOG_LEVEL.VERBOSE) {
      this.logLoading(`${runnerKey}: Container being removed`)
    }
  }
  removeContainerSuccess: logMethod = runnerKey => {
    if (logLevel >= LOG_LEVEL.VERBOSE) {
      this.logSuccess(`${runnerKey}: Container removed`)
    }
  }
}

const execLogger = new ExecLogger()
export default execLogger
