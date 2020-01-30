import { createDefaultHealthchecks } from '../../utils/createDefaultHealthchecks'
import { DockestError } from '../../Errors'
import { Runner } from '../../@types'
import { sleep } from '../../utils/sleep'

const logPrefix = '[Check Responsiveness]'

export const runHealthcheck = async ({
  runner,
  runner: { containerId, dockerComposeFileService, healthcheck, logger },
}: {
  runner: Runner
}) => {
  const recurse = async (responsivenessTimeout: number) => {
    logger.debug(`${logPrefix} Timeout in ${responsivenessTimeout}s`) // FIXME: Try getting replacePrevLine in here (may prove difficult with `runInBand: false`)

    if (responsivenessTimeout <= 0) {
      throw new DockestError(`${logPrefix} Timed out`, { runner })
    }

    try {
      logger.debug(`${logPrefix}`)

      await healthcheck({
        containerId,
        defaultHealthchecks: createDefaultHealthchecks({ runner }),
        dockerComposeFileService,
        logger,
      })

      logger.info(`${logPrefix} Success`, { success: true })
    } catch (error) {
      responsivenessTimeout--

      await sleep(1000)
      await recurse(responsivenessTimeout)
    }
  }

  await recurse(30)
}
