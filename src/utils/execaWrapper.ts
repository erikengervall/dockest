import execa from 'execa'
import { globalLogger } from '../loggers'
import { Runner } from '../runners/@types'

const execaWrapper = async (cmd: string, runner?: Runner): Promise<string> => {
  const trimmedCmd = cmd.replace(/\s+/g, ' ').trim()
  runner ? runner.runnerLogger.shellCmd(trimmedCmd) : globalLogger.shellCmd(trimmedCmd)

  const { stdout: result } = await execa(trimmedCmd, { shell: true })

  runner
    ? runner.runnerLogger.shellCmdSuccess(trimmedCmd)
    : globalLogger.shellCmdSuccess(trimmedCmd)

  return result
}

export default execaWrapper
