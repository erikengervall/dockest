import execa from 'execa'
import { runnerUtilsLogger } from '../loggers'

const execaWithLogging = async (cmd: string): Promise<string> => {
  const trimmedCmd = cmd.replace(/\s+/g, ' ').trim()

  runnerUtilsLogger.shellCmd(trimmedCmd)
  const { stdout: result } = await execa.shell(trimmedCmd)
  runnerUtilsLogger.shellCmdSuccess(result)

  return result
}

export default execaWithLogging
