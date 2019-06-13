import execa from 'execa'
import { runnerUtilsLogger } from '../../loggers'
import { trimmer } from './index'

const execaWithLogging = async (cmd: string): Promise<string> => {
  const trimmedCmd = trimmer(cmd)

  runnerUtilsLogger.shellCmd(trimmedCmd)
  const { stdout: result } = await execa.shell(trimmedCmd)
  runnerUtilsLogger.shellCmdSuccess(result)

  return result
}

export default execaWithLogging
