import { execaWrapper } from '../../utils/execaWrapper'
import { Runner } from '../../@types'

const logPrefix = '[Dockest Service Commands]'

export const runRunnerCommands = async ({ runner, runner: { commands } }: { runner: Runner }) => {
  for (let command of commands) {
    if (typeof command === 'function') {
      command = command(runner.containerId)
    }
    await execaWrapper(command, { runner, logPrefix, logStdout: true })
  }
}
