// tslint:disable:no-console

import { COLORS, ICONS, LOG_LEVEL } from '../constants'
import Dockest from '../index'

type logMethod = (message: string, logData?: object | string) => void

interface IExecLogger {
  setup: {
    setup: (runnerKey: string) => void
    setupSuccess: (runnerKey: string) => void
    startContainer: (runnerKey: string) => void
    startContainerSuccess: (runnerKey: string) => void
  }

  health: {
    checkHealth: (runnerKey: string) => void
    checkHealthSuccess: (runnerKey: string) => void
    checkResponsiveness: (runnerKey: string, timeout: number) => void
    checkResponsivenessSuccess: (runnerKey: string) => void
    checkConnection: (runnerKey: string, timeout: number) => void
    checkConnectionSuccess: (runnerKey: string) => void
  }

  teardown: {
    teardown: (runnerKey: string) => void
    teardownSuccess: (runnerKey: string) => void
    stopContainer: (runnerKey: string) => void
    stopContainerSuccess: (runnerKey: string) => void
    removeContainer: (runnerKey: string) => void
    removeContainerSuccess: (runnerKey: string) => void
  }
}

const { LOADING, SUCCESS } = ICONS
const {
  MISC: { RESET, BRIGHT },
} = COLORS
const logLevel = Dockest ? Dockest.config.dockest.logLevel : LOG_LEVEL.VERBOSE

const logSuccess: logMethod = (m, d) => console.log(`${SUCCESS} ${BRIGHT}${m}${RESET}`, d, `\n`)
const logLoading: logMethod = (m, d) => console.log(`${LOADING} ${BRIGHT}${m}${RESET}`, d)

const logger: IExecLogger = {
  setup: {
    setup: runnerKey => {
      if (logLevel >= LOG_LEVEL.NORMAL) {
        const topSeparator = new Array(runnerKey.length * 2).fill(`-`).join('')
        const bottomSeparator = new Array(runnerKey.length * 2).fill(`-`).join('')
        console.log(`
${topSeparator}\n\
${BRIGHT}  ${runnerKey}: Setting up${RESET}\n\
${bottomSeparator}`)
      }
    },
    setupSuccess: runnerKey => {
      if (logLevel >= LOG_LEVEL.NORMAL) {
        const topSeparator = new Array(runnerKey.length * 2).fill(`/`).join('')
        const bottomSeparator = new Array(runnerKey.length * 2).fill(`/`).join('')
        console.log(`
${topSeparator}\n\
${BRIGHT}  ${runnerKey}: Setup successful${RESET}\n\
${bottomSeparator}`)
      }
    },
    startContainer: runnerKey => {
      if (logLevel >= LOG_LEVEL.NORMAL) {
        logLoading(`${runnerKey}: Starting container`)
      }
    },
    startContainerSuccess: runnerKey => {
      if (logLevel >= LOG_LEVEL.NORMAL) {
        logSuccess(`${runnerKey}: Container running`)
      }
    },
  },

  health: {
    checkHealth: runnerKey => {
      if (logLevel >= LOG_LEVEL.NORMAL) {
        logLoading(`${runnerKey}: Healthchecking container`)
      }
    },
    checkHealthSuccess: runnerKey => {
      if (logLevel >= LOG_LEVEL.NORMAL) {
        logSuccess(`${runnerKey}: Healthcheck successful`)
      }
    },
    checkResponsiveness: (runnerKey, timeout) => {
      if (logLevel >= LOG_LEVEL.VERBOSE) {
        logLoading(`${runnerKey}: Checking container's responsiveness (Timeout in: ${timeout}s)`)
      }
    },
    checkResponsivenessSuccess: runnerKey => {
      if (logLevel >= LOG_LEVEL.VERBOSE) {
        logSuccess(`${runnerKey}: Container's responsiveness checked`)
      }
    },
    checkConnection: (runnerKey, timeout) => {
      if (logLevel >= LOG_LEVEL.VERBOSE) {
        logLoading(`${runnerKey}: Checking container's connection (Timeout in: ${timeout}s)`)
      }
    },
    checkConnectionSuccess: runnerKey => {
      if (logLevel >= LOG_LEVEL.VERBOSE) {
        logSuccess(`${runnerKey}: Container's connection checked`)
      }
    },
  },

  teardown: {
    teardown: runnerKey => {
      if (logLevel >= LOG_LEVEL.NORMAL) {
        logLoading(`${runnerKey}: Container being teared down`)
      }
    },
    teardownSuccess: runnerKey => {
      if (logLevel >= LOG_LEVEL.NORMAL) {
        logSuccess(`${runnerKey}: Container teared down`)
      }
    },
    stopContainer: runnerKey => {
      if (logLevel >= LOG_LEVEL.VERBOSE) {
        logLoading(`${runnerKey}: Container being stopped`)
      }
    },
    stopContainerSuccess: runnerKey => {
      if (logLevel >= LOG_LEVEL.VERBOSE) {
        logSuccess(`${runnerKey}: Container stopped`)
      }
    },
    removeContainer: runnerKey => {
      if (logLevel >= LOG_LEVEL.VERBOSE) {
        logLoading(`${runnerKey}: Container being removed`)
      }
    },
    removeContainerSuccess: runnerKey => {
      if (logLevel >= LOG_LEVEL.VERBOSE) {
        logSuccess(`${runnerKey}: Container removed`)
      }
    },
  },
}

export default logger
