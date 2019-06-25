import { DockestError } from '../errors'
import { Runner } from '../runners/@types'
import { execaWrapper, sleep } from './index'

const checkResponsiveness = async (runner: Runner) => {
  const {
    // FIXME: Fix type errors
    // @ts-ignore
    runnerConfig: { responsivenessTimeout },
    // @ts-ignore
    createResponsivenessCheckCmd,
  } = runner

  if (!responsivenessTimeout || !createResponsivenessCheckCmd) {
    return Promise.resolve()
  }
  // @ts-ignore
  const responsivenessCheckCmd = runner.createResponsivenessCheckCmd()

  const recurse = async (responsivenessTimeout: number): Promise<void> => {
    runner.runnerLogger.checkResponsiveness(responsivenessTimeout)

    if (responsivenessTimeout <= 0) {
      throw new DockestError(`Responsiveness timed out`)
    }

    try {
      await execaWrapper(responsivenessCheckCmd, runner)

      runner.runnerLogger.checkResponsivenessSuccess()
    } catch (error) {
      responsivenessTimeout--

      await sleep(1000)
      await recurse(responsivenessTimeout)
    }
  }

  await recurse(responsivenessTimeout)
}

export default checkResponsiveness
