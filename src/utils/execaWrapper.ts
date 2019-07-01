import execa from 'execa'
import { globalLogger } from '../loggers'
import { Runner } from '../runners/@types'

const execaWrapper = async (command: string, runner?: Runner): Promise<string> => {
  const trimmedCommand = command.replace(/\s+/g, ' ').trim()
  runner ? runner.runnerLogger.shellCmd(trimmedCommand) : globalLogger.shellCmd(trimmedCommand)

  const { stdout: result } = await execa(trimmedCommand, { shell: true })

  runner
    ? runner.runnerLogger.shellCmdSuccess(trimmedCommand)
    : globalLogger.shellCmdSuccess(trimmedCommand)

  return result
}

export default execaWrapper
