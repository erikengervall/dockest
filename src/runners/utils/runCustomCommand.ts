import execa from 'execa'
import { runnerUtilsLogger } from '../../loggers'

const runCustomCommand = async (
  runnerKey: string,
  command: string,
  opts: { verbose?: boolean } = {}
): Promise<void> => {
  const { verbose = false } = opts

  if (verbose) {
    runnerUtilsLogger.customShellCmd(runnerKey, command)
  }

  const { stdout: result } = await execa.shell(command)

  if (verbose) {
    runnerUtilsLogger.customShellCmdSuccess(runnerKey, result)
  }
}

export default runCustomCommand
