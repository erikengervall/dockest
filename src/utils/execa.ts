import execa from 'execa'
import { globalLogger } from '../loggers'

const execaWrapper = async (cmd: string): Promise<string> => {
  const trimmedCmd = cmd.replace(/\s+/g, ' ').trim()
  globalLogger.shellCmd(trimmedCmd)

  const { stdout: result } = await execa.shell(trimmedCmd)

  globalLogger.shellCmdSuccess(result)

  return result
}

export default execaWrapper
