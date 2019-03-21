import execa from 'execa'
import { runnerUtilsLogger } from '../../loggers'

const execaWithLogging = async (cmd: string): Promise<string> => {
  runnerUtilsLogger.shellCmd(cmd)
  const { stdout: result } = await execa.shell(cmd)
  runnerUtilsLogger.shellCmdSuccess(result)

  return result
}

export default execaWithLogging
