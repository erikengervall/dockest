import { DockestError } from '../../../errors'
import { runnerLogger } from '../../../loggers'
import { execa, sleep } from '../../utils'

const createCheckResponsiveness = async (cmd: string, responsivenessTimeout: number) => {
  const recurse = async (responsivenessTimeout: number): Promise<void> => {
    runnerLogger.checkResponsiveness(responsivenessTimeout)

    if (responsivenessTimeout <= 0) {
      throw new DockestError(`Responsiveness timed out`)
    }

    try {
      await execa(cmd)

      runnerLogger.checkResponsivenessSuccess()
    } catch (error) {
      responsivenessTimeout--

      await sleep(1000)
      await recurse(responsivenessTimeout)
    }
  }

  await recurse(responsivenessTimeout)
}

export default createCheckResponsiveness
