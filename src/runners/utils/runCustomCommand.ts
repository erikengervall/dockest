import execa from 'execa'
import { RunnerUtilsLogger } from '../../loggers'

const runCustomCommand = async (runnerKey: string, command: string): Promise<void> => {
  RunnerUtilsLogger.customShellCmd(runnerKey, command)
  const { stdout: result } = await execa.shell(command)
  RunnerUtilsLogger.customShellCmdSuccess(runnerKey, result)
}

export default runCustomCommand
