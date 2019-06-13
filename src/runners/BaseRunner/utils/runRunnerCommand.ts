import execa from 'execa'
import { runnerUtilsLogger } from '../../../loggers'

const runRunnerCommand = async (cmd: string): Promise<void> => {
  runnerUtilsLogger.customShellCmd(cmd)

  const { stdout: result } = await execa.shell(cmd)

  runnerUtilsLogger.customShellCmdSuccess(result)
}

export default runRunnerCommand
