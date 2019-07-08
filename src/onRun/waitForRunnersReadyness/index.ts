import { DockestConfig } from '../../index'
import { Runner } from '../../runners/@types'
import checkConnection from './checkConnection'
import checkResponsiveness from './checkResponsiveness'
import resolveContainerId from './resolveContainerId'
import runRunnerCommands from './runRunnerCommands'

const waitForRunnersReadyness = async (config: DockestConfig) => {
  const parallelPromises = []

  for (const runner of config.runners) {
    const work = (runner: Runner) => async () => {
      runner.runnerLogger.runnerSetup()

      await resolveContainerId(runner)
      await checkConnection(runner)
      await checkResponsiveness(runner)
      await runRunnerCommands(runner)

      runner.runnerLogger.runnerSetupSuccess()
    }

    !!config.opts.runInBand ? await work(runner)() : parallelPromises.push(work(runner))
  }

  await Promise.all(parallelPromises)
}

export default waitForRunnersReadyness
