import { BaseLogger, runnerLogger } from '../../loggers'
import { checkConnection, checkResponsiveness, resolveContainerId, runRunnerCommand } from './utils'

export type runnerMethods = {
  getComposeService: (
    dockerComposeFileName: string
  ) => {
    [key: string]: {
      image: string
      depends_on?: object
      port?: string
      ports: string[]
      environment?: {
        [key: string]: string | number
      }
    }
  }
  createResponsivenessCheckCmd?: () => string
}

class BaseRunner {
  public static setup = async (runner: any, runnerKey: string) => {
    runnerLogger.runnerSetup()
    BaseLogger.runnerKey = `${runnerKey}: ` // FIXME: Consider initializing a logger per runner instead
    runner.runnerKey = runnerKey

    // Get containerId
    const service = runner.runnerConfig.service
    const containerId = await resolveContainerId(service)
    runner.containerId = containerId

    // Healthchecks
    await checkConnection(runner)

    if (runner.runnerMethods.createResponsivenessCheckCmd) {
      const responsivenessCheckCmd = runner.runnerMethods.createResponsivenessCheckCmd()
      await checkResponsiveness(responsivenessCheckCmd, runner.runnerConfig.responsivenessTimeout)
    }

    // Run custom runner commands
    const commands = runner.runnerConfig.commands || []
    for (const cmd of commands) {
      await runRunnerCommand(cmd)
    }

    // Round up
    runnerLogger.runnerSetupSuccess()
    BaseLogger.runnerKey = ''
  }

  public containerId: string
  public runnerKey: string

  constructor() {
    this.containerId = ''
    this.runnerKey = ''
  }
}

export default BaseRunner
