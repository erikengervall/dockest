import execa from 'execa'
import { runnerUtilsLogger } from '../../loggers'

export default async (
  runnerKey: string,
  command: string,
  silent: boolean = false
): Promise<void> => {
  if (!silent) {
    runnerUtilsLogger.customShellCmd(runnerKey, command)
  }

  const { stdout: result } = await execa.shell(command)

  if (!silent) {
    runnerUtilsLogger.customShellCmdSuccess(runnerKey, result)
  }
}
