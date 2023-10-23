import { Runner } from '../../@types'
import { execaWrapper } from '../../utils/execa-wrapper'

const LOG_PREFIX = '[Dockest Service Commands]'

export const runRunnerCommands = async ({ runner, runner: { commands } }: { runner: Runner }) => {
  for (let command of commands) {
    if (typeof command === 'function') {
      command = command(runner.containerId)
    }
    await execaWrapper(command, { runner, logPrefix: LOG_PREFIX, logStdout: true })
  }
}
