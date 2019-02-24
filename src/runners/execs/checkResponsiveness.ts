import execa from 'execa'

import { DockestError } from '../../errors'
import { runnerLogger } from '../../loggers'
import { ExecOpts } from '../index'
import { sleep } from '../utils'

export default async (runnerConfig: any, execOpts: ExecOpts) => {
  const { service, responsivenessTimeout } = runnerConfig
  const {
    runnerKey,
    commandCreators: { createCheckResponsivenessCommand },
  } = execOpts
  if (!createCheckResponsivenessCommand) {
    return Promise.resolve()
  }
  const cmd = createCheckResponsivenessCommand(runnerConfig, execOpts)

  const recurse = async (responsivenessTimeout: number): Promise<void> => {
    runnerLogger.checkResponsiveness(responsivenessTimeout)

    if (responsivenessTimeout <= 0) {
      throw new DockestError(`${service} responsiveness timed out`)
    }

    try {
      runnerLogger.shellCmd(cmd)
      await execa.shell(cmd)

      runnerLogger.checkResponsivenessSuccess(runnerKey)
    } catch (error) {
      responsivenessTimeout--

      await sleep(1000)
      await recurse(responsivenessTimeout)
    }
  }

  await recurse(responsivenessTimeout)
}
