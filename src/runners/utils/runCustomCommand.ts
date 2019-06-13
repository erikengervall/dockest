import execa from 'execa'
import { runnerUtilsLogger } from '../../loggers'

const runCustomCommand = async (runnerKey: string, command: string): Promise<void> => {
  runnerUtilsLogger.customShellCmd(runnerKey, command)

  const { stdout: result } = await execa.shell(command)

  runnerUtilsLogger.customShellCmdSuccess(runnerKey, result)
}

export default runCustomCommand
