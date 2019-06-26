import execa from 'execa'
import { Runner } from '../runners/@types'

const runRunnerCommands = async (runner: Runner): Promise<void> => {
  const {
    runnerConfig: { commands = [] },
    runnerLogger,
  } = runner

  for (const cmd of commands) {
    runnerLogger.customShellCmd(cmd)

    const { stdout: result } = await execa(cmd, { shell: true })

    runnerLogger.customShellCmdSuccess(result)
  }
}

export default runRunnerCommands
