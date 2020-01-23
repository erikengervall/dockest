import { createDefaultHealthchecks } from '../../utils/createDefaultHealthchecks'
import { DockestError } from '../../Errors'
import { Runner } from '../../@types'
import { sleep } from '../../utils/sleep'

const logPrefix = '[Check Responsiveness]'

export const checkResponsiveness = async (runner: Runner) => {
  const { containerId, dockerComposeFileService, healthcheck, logger } = runner
  const responsivenessTimeout = 30

  const recurse = async (responsivenessTimeout: number, runner: Runner) => {
    logger.debug(`${logPrefix} Timeout in ${responsivenessTimeout}s`) // FIXME: Try getting replacePrevLine in here (may prove difficult with `runInBand: false`)

    if (responsivenessTimeout <= 0) {
      throw new DockestError(`${logPrefix} Timed out`, { runner })
    }

    try {
      logger.debug(`${logPrefix}`)

      await healthcheck(dockerComposeFileService, containerId, createDefaultHealthchecks(runner))

      logger.info(`${logPrefix} Success`, { success: true })
    } catch (error) {
      responsivenessTimeout--

      await sleep(1000)
      await recurse(responsivenessTimeout, runner)
    }
  }

  await recurse(responsivenessTimeout, runner)
}
