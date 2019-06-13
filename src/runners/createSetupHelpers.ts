import { BaseLogger, runnerLogger } from '../loggers'
import { Runners } from './index'
import { checkConnection, resolveContainerId, runCustomCommand } from './utils'

const createSetupHelper = (runner: Runners, runnerKey: string) => ({
  setupStarted: (): void => {
    runnerLogger.runnerSetup()
  },

  getRunTimeParameters: async (): Promise<void> => {
    BaseLogger.runnerKey = `${runnerKey}: ` // FIXME: Consider initializing a logger per runner instead
    runner.runnerKey = runnerKey

    const {
      runnerConfig: { service },
    } = runner
    const containerId = await resolveContainerId(service)
    runner.containerId = containerId
  },

  performHealthchecks: async (): Promise<void> => {
    await checkConnection(runner)

    if (runner.runnerMethods.checkResponsiveness) {
      await runner.runnerMethods.checkResponsiveness()
    }
  },

  runCustomCommands: async (): Promise<void> => {
    const commands = runner.runnerConfig.commands || []

    for (const cmd of commands) {
      await runCustomCommand(runnerKey, cmd)
    }
  },

  setupCompleted: (): void => {
    runnerLogger.runnerSetupSuccess()

    BaseLogger.runnerKey = ''
  },
})

export default createSetupHelper
