import { Runner } from '../../runners/@types'
import DockestError from '../../errors/DockestError'
import execaWrapper from '../../utils/execaWrapper'
import sleep from '../../utils/sleep'

// FIXME: Fix type errors
const checkResponsiveness = async (runner: Runner) => {
  const {
    // @ts-ignore
    runnerConfig: { responsivenessTimeout },
    logger,
    // @ts-ignore
    createResponsivenessCheckCmd,
  } = runner

  if (!responsivenessTimeout || !createResponsivenessCheckCmd) {
    return Promise.resolve()
  }
  // @ts-ignore
  const responsivenessCheckCmd = runner.createResponsivenessCheckCmd()

  const recurse = async (responsivenessTimeout: number, runner: Runner): Promise<void> => {
    // TODO: Try getting replacePrevLine in here
    logger.debug(`Checking responsiveness (Timeout in: ${responsivenessTimeout}s)`)

    if (responsivenessTimeout <= 0) {
      throw new DockestError(`Responsiveness timed out`)
    }

    try {
      await execaWrapper(responsivenessCheckCmd, runner)

      logger.debug(`Checked responsiveness successfully`)
    } catch (error) {
      responsivenessTimeout--

      await sleep(1000)
      await recurse(responsivenessTimeout, runner)
    }
  }

  await recurse(responsivenessTimeout, runner)
}

export default checkResponsiveness
