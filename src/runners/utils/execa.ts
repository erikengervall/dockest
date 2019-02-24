import execa from 'execa'
import { runnerUtilsLogger } from '../../loggers'

export default async (cmd: string): Promise<string> => {
  runnerUtilsLogger.shellCmd(cmd)
  const { stdout: result } = await execa.shell(cmd)
  runnerUtilsLogger.shellCmdSuccess(result)

  return result
}
