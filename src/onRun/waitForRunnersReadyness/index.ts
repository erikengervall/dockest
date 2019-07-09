import { DockestConfig } from '../../index'
import { Runner } from '../../runners/@types'
import checkConnection from './checkConnection'
import checkResponsiveness from './checkResponsiveness'
import resolveContainerId from './resolveContainerId'
import runRunnerCommands from './runRunnerCommands'

const setupRunner = async (runner: Runner) => {
  runner.runnerLogger.runnerSetup()

  await resolveContainerId(runner)
  await checkConnection(runner)
  await checkResponsiveness(runner)
  await runRunnerCommands(runner)

  runner.runnerLogger.runnerSetupSuccess()
}

const setupRunnerWithDependencies = async (runner: Runner) => {
  // Setup runner's dependencies
  for (const depRunner of runner.runnerConfig.dependsOn) {
    await setupRunner(depRunner)
  }

  // Setup runner
  await setupRunner(runner)
}

export default async (config: DockestConfig) => {
  const parallelPromises = []

  for (const runner of config.runners) {
    if (!!config.opts.runInBand) {
      await setupRunnerWithDependencies(runner)
    } else {
      parallelPromises.push(setupRunnerWithDependencies(runner))
    }
  }

  await Promise.all(parallelPromises)
}
