import { execaWrapper } from '../../utils/execaWrapper'
import { Runner } from '../../@types'

const logPrefix = '[Dockest Service Commands]'

export const runRunnerCommands = async ({ runner, runner: { commands } }: { runner: Runner }) => {
  for (const command of commands) {
    await execaWrapper(command, { runner, logPrefix, logStdout: true })
  }
}
