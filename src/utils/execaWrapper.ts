import execa from 'execa'
import Logger from '../Logger'
import { Runner } from '../runners/@types'
import trim from '../utils/trim'

const execaWrapper = async (command: string, runner?: Runner): Promise<string> => {
  const trimmedCommand = trim(command)
  const logger = runner ? runner.logger : Logger

  logger.debug(`Executing shell script: ${trimmedCommand}`)
  const { stdout: result } = await execa(trimmedCommand, { shell: true })
  logger.debug(`Successfully executed shell script with result: ${result}`)

  return result
}

export default execaWrapper
