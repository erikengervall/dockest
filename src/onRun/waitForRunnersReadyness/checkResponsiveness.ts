import DockestError from '../../errors/DockestError'
import { Runner } from '../../runners/@types'
import execaWrapper from '../../utils/execaWrapper'
import sleep from '../../utils/sleep'

const checkResponsiveness = async (runner: Runner) => {
  const {
    // FIXME: Fix type errors
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

  const recurse = async (responsivenessTimeout: number): Promise<void> => {
    logger.debug(`Checking container's responsiveness (Timeout in: ${responsivenessTimeout}s)`)

    if (responsivenessTimeout <= 0) {
      throw new DockestError(`Responsiveness timed out`)
    }

    try {
      await execaWrapper(responsivenessCheckCmd, runner)

      logger.debug(`Container's responsiveness checked`)
    } catch (error) {
      responsivenessTimeout--

      await sleep(1000)
      await recurse(responsivenessTimeout)
    }
  }

  await recurse(responsivenessTimeout)
}

export default checkResponsiveness
