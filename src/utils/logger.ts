// tslint:disable:no-console

import { COLORS, ICONS } from '../constants'
import Dockest from '../index'

const { VERBOSE, LOADING, SUCCESS, FAILED, ERROR } = ICONS
const {
  BG: { WHITE },
  FG: { BLACK, RED },
  MISC: { RESET, BRIGHT },
} = COLORS

type logMethod = (message: string, logData?: object | string) => void

interface ILogger {
  loading: logMethod
  success: logMethod
  failed: logMethod
  error: logMethod
  command: logMethod

  setup: (runnerKey: string) => void
  setupSuccess: (runnerKey: string) => void

  startContainer: (runnerKey: string) => void
  startContainerSuccess: (runnerKey: string) => void

  checkHealth: (runnerKey: string) => void
  checkHealthSuccess: (runnerKey: string) => void
  checkResponsiveness: (runnerKey: string, timeout: number) => void
  checkResponsivenessSuccess: (runnerKey: string) => void
  checkConnection: (runnerKey: string, timeout: number) => void
  checkConnectionSuccess: (runnerKey: string) => void

  stopContainer: (runnerKey: string) => void
  stopContainerSuccess: (runnerKey: string) => void
  removeContainer: (runnerKey: string) => void
  removeContainerSuccess: (runnerKey: string) => void

  teardown: (runnerKey: string) => void
  teardownSuccess: (runnerKey: string) => void
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
      console.log(
        `${VERBOSE} ${WHITE}${BLACK} Executed following shell script ${RESET}`,
        handleLogData(logData)
      )
    }
  },

  setup: runnerKey => {
    const topSeparator = new Array(runnerKey.length * 2).fill(`-`).join('')
    const bottomSeparator = new Array(runnerKey.length * 2).fill(`-`).join('')
    console.log(`
${topSeparator}\n\
${BRIGHT}  ${runnerKey}: Setting up${RESET}\n\
${bottomSeparator}`)
  },
  setupSuccess: runnerKey => {
    const topSeparator = new Array(runnerKey.length * 2).fill(`/`).join('')
    const bottomSeparator = new Array(runnerKey.length * 2).fill(`/`).join('')
    console.log(`
${topSeparator}\n\
${BRIGHT}  ${runnerKey}: Setup successful${RESET}\n\
${bottomSeparator}`)
  },

  startContainer: runnerKey => {
    console.log(`${LOADING} ${BRIGHT}${runnerKey}: Starting container${RESET}`)
  },
  startContainerSuccess: runnerKey => {
    console.log(`${SUCCESS} ${BRIGHT}${runnerKey}: Container running${RESET}\n`)
  },

  checkHealth: runnerKey => {
    console.log(`${LOADING} ${BRIGHT}${runnerKey}: Healthchecking container${RESET}`)
  },
  checkHealthSuccess: runnerKey => {
    console.log(`${SUCCESS} ${BRIGHT}${runnerKey}: Container healthchecked${RESET}\n`)
  },
  checkResponsiveness: (runnerKey, timeout) => {
    console.log(
      `${LOADING} ${BRIGHT}${runnerKey}: Checking container's responsiveness (Timeout in: ${timeout}s)${RESET}`
    )
  },
  checkResponsivenessSuccess: runnerKey => {
    console.log(`${SUCCESS} ${BRIGHT}${runnerKey}: Container's responsiveness checked${RESET}`)
  },
  checkConnection: (runnerKey, timeout) => {
    console.log(
      `${LOADING} ${BRIGHT}${runnerKey}: Checking container's connection (Timeout in: ${timeout}s)${RESET}`
    )
  },
  checkConnectionSuccess: runnerKey => {
    console.log(`${SUCCESS} ${BRIGHT}${runnerKey}: Container's connection checked${RESET}`)
  },

  stopContainer: runnerKey => {
    console.log(`${LOADING} ${BRIGHT}${runnerKey}: Stopping container${RESET}`)
  },
  stopContainerSuccess: runnerKey => {
    console.log(`${SUCCESS} ${BRIGHT}${runnerKey}: Container stopped${RESET}\n`)
  },
  removeContainer: runnerKey => {
    console.log(`${LOADING} ${BRIGHT}${runnerKey}: Removing container${RESET}`)
  },
  removeContainerSuccess: runnerKey => {
    console.log(`${SUCCESS} ${BRIGHT}${runnerKey}: Container removed${RESET}\n`)
  },

  teardown: runnerKey => {
    console.log(`${LOADING} ${BRIGHT}${runnerKey}: Tearing down container${RESET}`)
  },
  teardownSuccess: runnerKey => {
    console.log(`${SUCCESS} ${BRIGHT}${runnerKey}: Container teared down${RESET}\n`)
  },

  loading: (message, logData = '') => {
    console.log(`${LOADING} ${BRIGHT}${message}${RESET}`, logData)
  },
  success: (message, logData = '') => {
    console.log(`${SUCCESS} ${BRIGHT}${message}${RESET}`, logData, '\n')
  },
  failed: (message, logData = '') => {
    console.log(`${FAILED} ${RED}${message}${RESET}`, logData, '\n')
  },
  error: (message, logData = '') => {
    console.log(`${ERROR} ${RED}${message}${RESET}`, logData, '\n')
  },
}

export default logger
