import execa from 'execa'
import globalLogger from '../loggers/globalLogger'
import { Runner } from '../runners/@types'
import { trim } from '../utils/helpers'

const execaWrapper = async (command: string, runner?: Runner): Promise<string> => {
  const trimmedCommand = trim(command)
  runner ? runner.runnerLogger.shellCmd(trimmedCommand) : globalLogger.shellCmd(trimmedCommand)

  const { stdout: result } = await execa(trimmedCommand, { shell: true })

  runner
    ? runner.runnerLogger.shellCmdSuccess(trimmedCommand)
    : globalLogger.shellCmdSuccess(trimmedCommand)

  return result
}

export default execaWrapper
