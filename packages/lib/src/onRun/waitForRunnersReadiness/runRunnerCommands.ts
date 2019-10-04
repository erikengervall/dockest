import execa from 'execa' // eslint-disable-line import/default
import { Runner } from '../../runners/@types'

export default async (runner: Runner): Promise<void> => {
  const {
    runnerConfig: { commands = [] },
    logger,
  } = runner

  for (const command of commands) {
    logger.debug(`Executed custom command: ${command}`)
    const { stdout: result } = await execa(command, { shell: true })
    logger.debug(`Executed custom command successfully with result: ${result}`, { nl: 1 })
  }
}
