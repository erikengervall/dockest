import execa from 'execa' // eslint-disable-line import/default
import trim from './trim'
import { Runner } from '../runners/@types'
import Logger from '../Logger'

const execaWrapper = async (command: string, runner?: Runner): Promise<string> => {
  const trimmedCommand = trim(command)
  const logger = runner ? runner.logger : Logger

  logger.debug(`Executing shell script: ${trimmedCommand}`)
  const { stdout } = await execa(trimmedCommand, { shell: true })
  logger.debug(`Successfully executed shell script ${trimmedCommand}`)

  return stdout
}

export default execaWrapper
