import execa from 'execa'
import { Runner } from '../../runners/@types'

export default async (runner: Runner): Promise<void> => {
  const {
    runnerConfig: { commands = [] },
    runnerLogger,
  } = runner

  for (const command of commands) {
    runnerLogger.customShellCmd(command)

    const { stdout: result } = await execa(command, { shell: true })

    runnerLogger.customShellCmdSuccess(result)
  }
}
