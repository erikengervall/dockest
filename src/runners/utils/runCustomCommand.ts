import execa from 'execa'
import { runnerUtilsLogger } from '../../loggers'

const runCustomCommand = async (runnerKey: string, cmd: string): Promise<void> => {
  runnerUtilsLogger.customShellCmd(runnerKey, cmd)

  const { stdout: result } = await execa.shell(cmd)

  runnerUtilsLogger.customShellCmdSuccess(runnerKey, result)
}

export default runCustomCommand
