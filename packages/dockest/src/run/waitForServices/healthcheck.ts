import { DockestError } from '../../Errors'
import { execaWrapper } from '../../utils/execaWrapper'
import { sleep } from '../../utils/sleep'
import { Runner } from '../../@types'

const logPrefix = '[Check Responsiveness]'

export const checkResponsiveness = async (runner: Runner) => {
  const { containerId, healthchecks, logger } = runner
  const responsivenessTimeout = 30

  await Promise.all(
    healthchecks.map(async healthcheck => {
      const recurse = async (responsivenessTimeout: number, runner: Runner) => {
        logger.debug(`${logPrefix} Timeout in ${responsivenessTimeout}s`) // FIXME: Try getting replacePrevLine in here (may prove difficult when running in parallel)

        if (responsivenessTimeout <= 0) {
          throw new DockestError(`${logPrefix} Timed out`, { runner })
        }

        try {
          const command = healthcheck(runner.dockerComposeFileService, containerId)
          await execaWrapper(command, { runner, logPrefix })

          logger.info(`${logPrefix} Success`, { success: true })
        } catch (error) {
          responsivenessTimeout--

          await sleep(1000)
          await recurse(responsivenessTimeout, runner)
        }
      }

      await recurse(responsivenessTimeout, runner)
    }),
  )
}
